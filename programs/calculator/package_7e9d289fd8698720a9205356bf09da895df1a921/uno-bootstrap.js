
config.fetch_file_cb = asset => App.fetchFile(asset);
config.environmentVariables = config.environmentVariables || {};

var Module = {
    onRuntimeInitialized: function () {

        if (config.environmentVariables) {
            for (let key in config.environmentVariables) {
                if (config.environmentVariables.hasOwnProperty(key)) {
                    if (config.enable_debugging) console.log(`Setting ${key}=${config.environmentVariables[key]}`);
                    MONO.mono_wasm_setenv(key, config.environmentVariables[key]);
                }
            }
        }

        if (config.generate_aot_profile) {
            MONO.mono_wasm_init_aot_profiler({
                write_at: "Uno.ProfilerSupport::StopProfile",
                send_to: "Uno.ProfilerSupport::DumpAotProfileData"
            });
        }

        MONO.mono_load_runtime_and_bcl(
            config.vfs_prefix,
            config.deploy_prefix,
            config.enable_debugging,
            config.file_list,
            function () {

                if (config.generate_aot_profile) {
                    var initializeProfile = Module.mono_bind_static_method("[Uno.Wasm.Profiler] Uno.ProfilerSupport:Initialize");
                    if (initializeProfile) {
                        initializeProfile();
                    }
                }

                App.init();
            },
            config.fetch_file_cb
        );
    },
    instantiateWasm: function (imports, successCallback) {

        if (typeof WasmOffsetConverter !== 'undefined') {
            // Workaround for https://github.com/emscripten-core/emscripten/issues/9836
            originalSuccessCallback = successCallback;

            successCallback = function (instance, module) {
                getBinaryPromise().then(function (binary) {
                    wasmOffsetConverter = new WasmOffsetConverter(new Uint8Array(binary), module);
                    removeRunDependency('offset-converter');

                    originalSuccessCallback(instance, module);
                });
            };
        }

        // There's no way to get the filename from mono.js right now.
        // so we just hardcode it.
        const wasmUrl = config.mono_wasm_runtime || "mono.wasm";

        if (ENVIRONMENT_IS_NODE) {
            return WebAssembly
                .instantiate(getBinary(wasmUrl), imports)
                .then(results => {
                    successCallback(results.instance, results.module);
                });
        } else if (typeof WebAssembly.instantiateStreaming === 'function') {
            App.fetchWithProgress(
                wasmUrl,
                loaded => App.reportProgressWasmLoading(loaded))
                .then(response => {
                    if (Module.isElectron()) {
                        /*
                         * Chromium does not yet suppport instantiateStreaming
                         * with custom headers.
                         */
                        return response.arrayBuffer()
                            .then(buffer => {
                                WebAssembly
                                    .instantiate(buffer, imports)
                                    .then(results => {
                                        successCallback(results.instance, results.module);
                                    });
                            });
                    }
                    else {
                        return WebAssembly
                            .instantiateStreaming(response, imports)
                            .then(results => {
                                successCallback(results.instance, results.module);
                            });
                    }
                });
        }
        else {
            fetch(wasmUrl)
                .then(response => {
                    response.arrayBuffer().then(function (buffer) {
                        return WebAssembly.instantiate(buffer, imports)
                            .then(results => {
                                successCallback(results.instance);
                            });
                    });
                });
        }

        return {}; // Compiling asynchronously, no exports.
    },
    isElectron: function () {
        return navigator.userAgent.indexOf('Electron') !== -1;
    }
};

var MonoRuntime = {
    // This block is present for backward compatibility when "MonoRuntime" was provided by mono-wasm.

    init: function () {
        this.load_runtime = Module.cwrap("mono_wasm_load_runtime", null, ["string", "number"]);
        this.assembly_load = Module.cwrap("mono_wasm_assembly_load", "number", ["string"]);
        this.find_class = Module.cwrap("mono_wasm_assembly_find_class", "number", ["number", "string", "string"]);
        this.find_method = Module.cwrap("mono_wasm_assembly_find_method", "number", ["number", "string", "number"]);
        this.invoke_method = Module.cwrap("mono_wasm_invoke_method", "number", ["number", "number", "number"]);
        this.mono_string_get_utf8 = Module.cwrap("mono_wasm_string_get_utf8", "number", ["number"]);
        this.mono_string = Module.cwrap("mono_wasm_string_from_js", "number", ["string"]);
        this.mono_wasm_obj_array_new = Module.cwrap("mono_wasm_obj_array_new", "number", ["number"]);
        this.mono_wasm_obj_array_set = Module.cwrap("mono_wasm_obj_array_set", null, ["number", "number", "number"]);
    },

    conv_string: function (mono_obj) {
        if (mono_obj === 0)
            return null;
        const raw = this.mono_string_get_utf8(mono_obj);
        const res = Module.UTF8ToString(raw);
        Module._free(raw);

        return res;
    },

    call_method: function (method, this_arg, args) {
        const args_mem = Module._malloc(args.length * 4);
        const eh_throw = Module._malloc(4);
        for (let i = 0; i < args.length; ++i)
            Module.setValue(args_mem + i * 4, args[i], "i32");
        Module.setValue(eh_throw, 0, "i32");

        const res = this.invoke_method(method, this_arg, args_mem, eh_throw);

        const eh_res = Module.getValue(eh_throw, "i32");

        Module._free(args_mem);
        Module._free(eh_throw);

        if (eh_res !== 0) {
            const msg = this.conv_string(res);
            throw new Error(msg);
        }

        return res;
    }
};

var App = {
    preInit() {
        this.body = document.getElementById("uno-body");

        this.initProgress();
    },

    init() {
        this.initializeRequire();
    },

    mainInit: function () {
        try {
            App.attachDebuggerHotkey(config.file_list);
            App.attachProfilerHotKey();
            MonoRuntime.init();
            BINDING.bindings_lazy_init();
            App.timezoneSetup();

            var mainMethod = BINDING.resolve_method_fqn(config.uno_main);

            if (typeof mainMethod === "undefined") {
                throw `Unable to find entrypoint in ${config.uno_main}`;
            }

            signature = Module.mono_method_get_call_signature(mainMethod);

            if (signature === "") {
                BINDING.call_method(mainMethod, null, signature, []);
            } else {
                let array = ENVIRONMENT_IS_NODE
                    ? BINDING.js_array_to_mono_array(process.argv)
                    : BINDING.js_array_to_mono_array([]);

                MonoRuntime.call_method (mainMethod, null, [array]);
            }
        } catch (e) {
            console.error(e);
        }

        this.cleanupInit();
    },

    timezoneSetup() {
        var timeZoneSetupMethod = Module.mono_bind_static_method("[Uno.Wasm.TimezoneData] Uno.Wasm.TimezoneData.TimezoneHelper:Setup");

        if (timeZoneSetupMethod) {
            timeZoneSetupMethod(Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
    },

    cleanupInit: function () {
        // Remove loader node, not needed anymore
        if (this.loader && this.loader.parentNode) {
            this.loader.parentNode.removeChild(this.loader);
        }
    },

    initProgress: function () {
        this.loader = this.body.querySelector(".uno-loader");

        if (this.loader) {
            const totalBytesToDownload = config.mono_wasm_runtime_size + config.total_assemblies_size;
            const progress = this.loader.querySelector("progress");
            progress.max = totalBytesToDownload;
            progress.value = ""; // indeterminate
            this.progress = progress;
        }

        const configLoader = () => {
            if (manifest && manifest.splashScreenColor) {
                this.loader.style.setProperty("--bg-color", manifest.splashScreenColor);
            }
            if (manifest && manifest.accentColor) {
                this.loader.style.setProperty("--accent-color", manifest.accentColor);
            }
            const img = this.loader.querySelector("img");
            if (manifest && manifest.splashScreenImage) {
                if (!manifest.splashScreenImage.match(/^(http(s)?:\/\/.)/g) ) {
                    // Local images need to be prefixed with the app based path
                    manifest.splashScreenImage = `${config.uno_app_base}/${manifest.splashScreenImage}`;
                }

                img.setAttribute("src", manifest.splashScreenImage);
            } else {
                img.setAttribute("src", "https://nv-assets.azurewebsites.net/logos/uno-splashscreen-light.png");
            }
        };

        let manifest = window["UnoAppManifest"];
        if (manifest) {
            configLoader();
        } else {

            for (var i = 0; i < config.uno_dependencies.length; i++) {
                if (config.uno_dependencies[i].endsWith('AppManifest')
                    || config.uno_dependencies[i].endsWith('AppManifest.js')) {
                    require([config.uno_dependencies[i]], function () {
                        manifest = window["UnoAppManifest"];
                        configLoader();
                    });
                    break;
                }
            }
        }

    },

    reportProgressWasmLoading: function (loaded) {
        if (this.progress) {
            this.progress.value = loaded;
        }
    },

    reportAssemblyLoading: function (adding) {
        if (this.progress) {
            this.progress.value += adding;
        }
    },

    raiseLoadingError: function (err) {
        this.loader.setAttribute("loading-alert", "error");

        const alert = this.loader.querySelector(".alert");

        let title = alert.getAttribute("title");
        if (title) {
            title += `\n${err}`;
        } else {
            title = `${err}`;
        }
        alert.setAttribute("title", title);
    },

    raiseLoadingWarning: function (msg) {
        if (this.loader.getAttribute("loading-alert") !== "error") {
            this.loader.setAttribute("loading-alert", "warning");
        }

        const alert = this.loader.querySelector(".alert");

        let title = alert.getAttribute("title");
        if (title) {
            title += `\n${msg}`;
        } else {
            title = `${msg}`;
        }
        alert.setAttribute("title", title);
    },

    fetchWithProgress: function (url, progressCallback) {

        if (!this.loader) {
            // No active loader, simply use the fetch API directly...
            return fetch(url, this.getFetchInit(url));
        }

        return fetch(url, this.getFetchInit(url))
            .then(response => {
                if (!response.ok) {
                    throw Error(`${response.status} ${response.statusText}`);
                }

                try {
                    let loaded = 0;

                    // Wrap original stream with another one, while reporting progress.
                    const stream = new ReadableStream({
                        start(ctl) {
                            const reader = response.body.getReader();

                            read();

                            function read() {
                                reader.read()
                                    .then(
                                        ({ done, value }) => {
                                            if (done) {
                                                ctl.close();
                                                return;
                                            }
                                            loaded += value.byteLength;
                                            progressCallback(loaded, value.byteLength);
                                            ctl.enqueue(value);
                                            read();
                                        })
                                    .catch(error => {
                                        console.error(error);
                                        ctl.error(error);
                                    });
                            }
                        }
                    });

                    // We copy the previous response to keep original headers.
                    // Not only the WebAssembly will require the right content-type,
                    // but we also need it for streaming optimizations:
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=719172#c28
                    return new Response(stream, response);
                }
                catch (ex) {
                    // ReadableStream may not be supported (Edge as of 42.17134.1.0)
                    return response;
                }
            })
            .catch(err => this.raiseLoadingError(err));
    },

    getFetchInit: function (url) {
        const fileName = url.substring(url.lastIndexOf("/") + 1);

        const init = { credentials: "omit" };

        if (config.files_integrity.hasOwnProperty(fileName)) {
            init.integrity = config.files_integrity[fileName];
        }

        return init;
    },

    fetchFile: function (asset) {

        if (asset.lastIndexOf(".dll") !== -1) {
            asset = asset.replace(".dll", `.${config.assemblyFileExtension}`);
        }

        if (asset.startsWith("icudt") && asset.endsWith(".dat")) {
            asset = `${config.uno_app_base}/${asset}`;
        }

        asset = asset.replace("/managed/", `/${config.uno_remote_managedpath}/`);

        if (ENVIRONMENT_IS_NODE) {
            var fs = require('fs');

            console.log('Loading... ' + asset);
            var binary = fs.readFileSync(asset);
            var resolve_func2 = function (resolve, reject) {
                resolve(new Uint8Array(binary));
            };
            var resolve_func1 = function (resolve, reject) {
                var response = {
                    ok: true,
                    url: asset,
                    arrayBuffer: function () {
                        return new Promise(resolve_func2);
                    }
                };
                resolve(response);
            };
            return new Promise(resolve_func1);
        } else {
            if (!config.enable_debugging) {
                // Assembly fetch streaming is disabled during debug, it seems to
                // interfere with the ability for mono or the chrome debugger to 
                // initialize the debugging session properly. Streaming in debug is
                // not particularly interesting, so we can skip it.

                const assemblyName = asset.substring(asset.lastIndexOf("/") + 1);
                if (config.assemblies_with_size.hasOwnProperty(assemblyName)) {
                    return this
                        .fetchWithProgress(asset, (loaded, adding) => this.reportAssemblyLoading(adding));
                }
            }

            return fetch(asset);
        }
    },

    initializeRequire() {

        // Uno.Wasm.Bootstrap is using "requirejs" by default, which is an AMD implementation
        // But when run with NodeJS or Electron, it's using CommonJS instead of AMD
        this.isUsingCommonJS = ENVIRONMENT_IS_NODE || Module.isElectron();

        if (config.enable_debugging) console.log("Done loading the BCL");

        if (config.uno_dependencies && config.uno_dependencies.length !== 0) {
            let pending = config.uno_dependencies.length;

            const checkDone = (dependency) => {
                --pending;
                if (config.enable_debugging) console.log(`Loaded dependency (${dependency}) - remains ${pending} other(s).`);
                if (pending === 0) {
                    App.mainInit();
                }
            };

            config.uno_dependencies.forEach((dependency) => {
                if (config.enable_debugging) console.log(`Loading dependency (${dependency})`);

                let processDependency = instance => {

                    // If the module is built on emscripten, intercept its loading.
                    if (instance && instance.HEAP8 !== undefined) {

                        const existingInitializer = instance.onRuntimeInitialized;

                        if (config.enable_debugging) console.log(`Waiting for dependency (${dependency}) initialization`);

                        instance.onRuntimeInitialized = () => {
                            checkDone(dependency);

                            if (existingInitializer)
                                existingInitializer();
                        };
                    }
                    else {
                        checkDone(dependency);
                    }
                };

                this.require([dependency], processDependency);
            });
        }
        else {
            App.mainInit();
        }
    },

    require(modules, callback) {
        if (this.isUsingCommonJS) {
            modules.forEach(id => {
                // Emulate asynchronous process of AMD
                setTimeout(() => {
                    const d = require('./' + id);
                    callback(d);
                }, 0);
            });
        } else {
            if (typeof require === undefined) {
                throw `Require.js has not been loaded yet. If you have customized your index.html file, make sure that <script src="./require.js"></script> does not contain the defer directive.`;
            }

            require(modules, callback);
        }
    },

    hasDebuggingEnabled: function () {
        return hasReferencedPdbs && App.currentBrowserIsChrome;
    },

    attachDebuggerHotkey: function (loadAssemblyUrls) {

        if (ENVIRONMENT_IS_WEB) {
            //
            // Imported from https://github.com/aspnet/Blazor/tree/release/0.7.0
            //
            // History:
            //  2019-01-14: Adjustments to make the debugger helper compatible with Uno.Bootstrap.
            //

            App.currentBrowserIsChrome = window.chrome
                && navigator.userAgent.indexOf("Edge") < 0; // Edge pretends to be Chrome

            hasReferencedPdbs = loadAssemblyUrls
                .some(function (url) { return /\.pdb$/.test(url); });

            // Use the combination shift+alt+D because it isn't used by the major browsers
            // for anything else by default
            const altKeyName = navigator.platform.match(/^Mac/i) ? "Cmd" : "Alt";

            if (App.hasDebuggingEnabled()) {
                console.info(`Debugging hotkey: Shift+${altKeyName}+D (when application has focus)`);
            }

            // Even if debugging isn't enabled, we register the hotkey so we can report why it's not enabled
            document.addEventListener("keydown", function (evt) {
                if (evt.shiftKey && (evt.metaKey || evt.altKey) && evt.code === "KeyD") {
                    if (!hasReferencedPdbs) {
                        console.error("Cannot start debugging, because the application was not compiled with debugging enabled.");
                    }
                    else if (!App.currentBrowserIsChrome) {
                        console.error("Currently, only Chrome is supported for debugging.");
                    }
                    else {
                        App.launchDebugger();
                    }
                }
            });
        }
    },

    attachProfilerHotKey: function () {

        if (ENVIRONMENT_IS_WEB && config.generate_aot_profile) {

            // Use the combination shift+alt+D because it isn't used by the major browsers
            // for anything else by default
            const altKeyName = navigator.platform.match(/^Mac/i) ? "Cmd" : "Alt";

            console.info(`Profiler stop hotkey: Shift+${altKeyName}+P (when application has focus), or Run App.saveProfile() from the browser debug console.`);

            // Even if debugging isn't enabled, we register the hotkey so we can report why it's not enabled
            document.addEventListener(
                "keydown",
                function (evt) {
                    if (evt.shiftKey && (evt.metaKey || evt.altKey) && evt.code === "KeyP") {
                        App.saveProfile();
                  }
            });
        }
    },

    saveProfile: function () {
        var stopProfile = Module.mono_bind_static_method("[Uno.Wasm.Profiler] Uno.ProfilerSupport:StopProfile");
        stopProfile();

        // Export the file
        var a = window.document.createElement('a');
        var blob = new Blob([Module.aot_profile_data]);
        a.href = window.URL.createObjectURL(blob);
        a.download = "aot.profile";

        // Append anchor to body.
        document.body.appendChild(a);
        a.click();

        // Remove anchor from body
        document.body.removeChild(a);
    },

    launchDebugger: function () {

        //
        // Imported from https://github.com/aspnet/Blazor/tree/release/0.7.0
        //
        // History:
        //  2019-01-14: Adjustments to make the debugger helper compatible with Uno.Bootstrap.
        //

        // The noopener flag is essential, because otherwise Chrome tracks the association with the
        // parent tab, and then when the parent tab pauses in the debugger, the child tab does so
        // too (even if it's since navigated to a different page). This means that the debugger
        // itself freezes, and not just the page being debugged.
        //
        // We have to construct a link element and simulate a click on it, because the more obvious
        // window.open(..., 'noopener') always opens a new window instead of a new tab.
        const link = document.createElement("a");
        link.href = `_framework/debug?url=${encodeURIComponent(location.href)}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.click();
    }
};

if (typeof window === 'object' /* ENVIRONMENT_IS_WEB */) {

    document.addEventListener("DOMContentLoaded", () => App.preInit());

    if (config.enable_pwa && 'serviceWorker' in navigator) {
        if (navigator.serviceWorker.controller) {
            console.debug("Active service worker found, skipping register");
        } else {
            console.debug('Registering service worker now');

            navigator.serviceWorker
                .register(
                    "./service-worker.js", {
                    scope: "./"
                })
                .then(function () {
                    console.debug('Service Worker Registered');
                });
        }
    }
}
else if (typeof global === 'object') {
    globalThis = global;
}
