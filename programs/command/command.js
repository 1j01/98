// HACK: This should be window.Terminal once upgraded to 4.0.1
var term = new window.Terminal.Terminal({
	theme: {
		selection: "#fff", // in concert with...
		// .xterm-selection-layer {
		// 	mix-blend-mode: exclusion;
		// }
	},
});
term.open(document.getElementById('terminal'));

function resize () {
	term.resize(Math.floor(window.innerWidth/10), Math.floor(window.innerHeight/20));
}
window.addEventListener("resize", resize);
resize();

function runFakeTerminal() {
	if (term._initialized) {
		return;
	}

	term._initialized = true;

	term.prompt = () => {
		term.write('\r\nC:\\WINDOWS\> ');
	};

	term.writeln('');
	term.writeln('');
	term.writeln('Microsoft(R) Windows 98');
	term.writeln('    (C)Copyright Microsoft Corp 1981-1999.');
	term.writeln('');
	// The prompt text seems to get wrapped to several new lines without waiting like this.
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			term.prompt();
		});
	});

	term.onData(e => {
		switch (e) {
			case '\r': // Enter
			case '\u0003': // Ctrl+C
				term.prompt();
				break;
			case '\u007F': // Backspace (DEL)
				// Do not delete the prompt
				if (term._core.buffer.x > 2) {
					term.write('\b \b');
				}
				break;
			default: // Print all other characters for demo
				term.write(e);
		}
	});
}

runFakeTerminal();
