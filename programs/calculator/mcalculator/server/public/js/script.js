function initialise() {
    window.setPrimaryDisplay = function setPrrimaryDisplayToBeCalledFromEngineWithDisplayString(displayStr) {
        displayStr = displayStr.replace("e", "e<br>");
        //fix for Ove<br>flow
        if (!displayStr === 'Overflow') /*TODO add some other cases*/ {
            displayStr = displayStr.replace("e", "e<br>");
        }
        document.querySelector('#display > #primary').innerHTML = displayStr;
    }
    window.setExpressionDisplay = function setExpresionDisplayOverThePrimaryOne(displayStr) {
        this.document.querySelector('#display > #expression').textContent = displayStr;
    }
    window.Module._load(); //TODO try to asyncify it
    revealCalc();
    var standardKeyboardMap = {
        'Escape': '81', 'Esc': '81',
        'Delete': '82', 'Del': '82',
        'Backspace': '83',
        '.': '84', 'Decimal': '84',
        '/': '91', 'Divide': '91',
        '*': '92', 'Multiply': '92',
        '+': '93', 'Add': '93',
        '-': '94', 'Suntract': '94',
        '%': '118',
        '=': '121', 'Enter': '121',
        '0': '130',
        '1': '131',
        '2': '132',
        '3': '133',
        '4': '134',
        '5': '135',
        '6': '136',
        '7': '137',
        '8': '138',
        '9': '139',
        'r': '114', 'R': '114',
    }
    function sendCommand(commandStr) {
        window.Module._send(parseInt(commandStr));
    }
    function sendMemoryCommand(commandStr, itm) {
        let items = document.querySelectorAll('#panel > .mempanel > .memory-item:not(#skel)');//Hope that returns in order
        let idx = Array.from(items).indexOf(itm);
        window._memComm(parseInt(commandStr), parseInt(idx));
        if (commandStr == '3')/* MC*/ {
            let panel = document.querySelector('#panel > .mempanel');
            panel.removeChild(itm);
        }
    }
    /**
    * send button clicks as commands
    */
    document.querySelectorAll('button').forEach((button) => {
        button = filterOut(button);
        if (button) {
            button.addEventListener('click', (ev) => {
                let commandStr = ev.target.id;
                //TODO do some more checks on commands
                sendCommand(commandStr);
            })
        }

    })

    /**
     * History and Memory unveiling in compact mode
     */

    let sidebarUp = 0; //maybe stayes in closure or something
    window.sidebarDown = function lowersTheSidebarToInitialState() {
        let sidebar = this.document.querySelector('#sidebar');
        sidebar.style.transform = 'translateY(0)';
        sidebarUp = 0;
        sidebar.style.height = '100%';
        sidebar.querySelectorAll('.del').forEach(d => {
            d.style.display = 'none';
        });
    }
    sidebarDown();
    function toggleSidebar() {
        let sidebar = this.document.querySelector('#sidebar');
        if (!sidebarUp) {
            sidebar.style.transform = 'translateY(-100%)';
            sidebar.style.height = '70%';
            sidebarUp = 1;
            sidebar.querySelectorAll('.del').forEach(d => {
                d.style.display = 'block';
            })
        }
        else {
            sidebarDown();
        }
    }

    window.onresize = function () {
        if (sidebarUp) {
            this.sidebarDown();
            sidebarUp = 0;
        }
    }
    window.toggleHistory = function togglesHistoryPanelUpDown() {
        toggleSidebar();
        let historyMenu = this.document.querySelector('#sidebar > #nav > #hspanel');
        makeActive(historyMenu);
    }
    window.toggleMemory = function togglesMemoryPanel() {
        toggleSidebar();
        let memoryMenu = this.document.querySelector('#sidebar > #nav > #mempanel');
        makeActive(memoryMenu);
    }


    /**
    * listens to keyboard clicks amd map them to COMMAND
    */
    document.addEventListener('keydown', (ev) => {
        if (ev.defaultPrevented)
            return;
        //just standard for now
        let commandStr = standardKeyboardMap[ev.key];
        if (commandStr != undefined) {
            let btn = document.getElementById(commandStr);

            /* for that flicking effect */
            btn.classList.add('active');
            setTimeout(() => {
                btn.classList.remove('active');
            }, 100);

            btn.click();
        }
    })
    /**
    * Sidebar navigation // please rewrite this shitty code better
    */
    function makeActive(menuItem) {
        document.querySelectorAll('#sidebar > #nav > .nav-item').forEach(it => {
            it.classList.remove('active');
        });
        document.querySelectorAll('#panel > *').forEach(it => {
            it.style.display = 'none';
        });
        menuItem.classList.add('active');
        let id = menuItem.id;
        document.querySelector('#panel > .' + id).style.display = 'block';
    }

    document.querySelectorAll('#sidebar > #nav > .nav-item').forEach((item) => {
        item.addEventListener('click', (ev) => {
            makeActive(ev.target);
        });
    });

    /**
     * removeFrom function
     */
    window.removeFrom = function removeNodeItemsMatchingQuery(node, query) {
        node.querySelectorAll(query).forEach((elem) => {
            elem.remove();
        });
    }

    /**
    * History related funcs
    */
    window.setHistoryItem = function setHistoryItemAddingOneMoreItemToList(hEx, hRes) {
        let hItem = this.document.createElement('button');
        hItem.className = 'history-item';
        let hItemEx = this.document.createElement('div');
        hItemEx.className = 'expression';
        hItem.appendChild(hItemEx);
        let hItemRes = this.document.createElement('div');
        hItemRes.className = 'result';
        hItem.appendChild(hItemRes);
        //created an empty dom node 
        hItemEx.textContent = hEx;
        hItemRes.textContent = hRes;

        let panel = this.document.querySelector('#panel > .hspanel');
        //if placeholder
        let placeholder = this.document.querySelector('#panel > .hspanel > p');
        let delButton = this.document.querySelector('#panel > .hspanel > button.del');

        placeholder.style.display = 'none'; //maybe check first
        delButton.style.display = 'block';
        panel.prepend(hItem);

    }
    window.clearHistory = function clearHistoryOfEngineAndclearPanel() {
        this.window.Module._clearHs();
        let panel = this.document.querySelector('#panel .hspanel');
        removeFrom(panel, "button.history-item");
        panel.querySelector('p').style.display = 'block';
        panel.querySelector('button.del').style.display = 'none';
    }

    /**
     * Memory related funcs
    */
    window.setMemoryItem = function appendToListOfMemoryItem(memStr) {
        let itemSkel = this.document.querySelector('#panel > .mempanel > button.memory-item#skel');
        let itemBox = itemSkel.cloneNode(true);
        itemBox.style.display = 'block';
        itemBox.id = '';
        itemBox.querySelector('.value').textContent = memStr;

        let panel = this.document.querySelector('#panel > .mempanel');
        let placeholder = panel.querySelector('p');
        let delButton = panel.querySelector('button.del');

        placeholder.style.display = 'none';
        delButton.style.display = 'block';
        panel.prepend(itemBox);

        let commOf = {
            'mp': '1',
            'mm': '2',
            'mc': '3'
        }
        itemBox.querySelectorAll('.btns > *').forEach(btn => {
            btn.addEventListener('click', ev => {
                let comm = commOf[ev.target.className];
                sendMemoryCommand(this.parseInt(comm), itemBox);
            });
        });
        this.document.querySelectorAll('button.onmem').forEach((btn) => {
            btn.classList.remove('disabled');
            btn.addEventListener('click', ev => {
                let commandStr = ev.target.id;
                if (commandStr == '122') {
                    clearAllMemory();
                }
                sendCommand(commandStr);
            })
        });
    }
    window.updateMemoryItem = function updatesTheMemoryItemInListAtDesiredIndex(mStr, mIdx) {
        let panel = this.document.querySelector('#panel > .mempanel');
        item = panel.querySelectorAll('button.memory-item:not(#skel)')[mIdx];
        item.querySelector('.value').textContent = mStr;
    }
    window.clearAllMemory = function clearAllItemsInMemoryList() {
        this._clearMem();
        let panel = this.document.querySelector('#panel > .mempanel');
        removeFrom(panel, 'button.memory-item:not(#skel)');
        panel.querySelector('p').style.display = 'block';
        panel.querySelector('button.del').style.display = 'none';
        this.document.querySelectorAll('button.onmem').forEach((btn) => {
            btn.classList.add('disabled');
            btn.addEventListener('click', ev => ev);//do nothing on click
        });
    }

    function filterOut(button) {
        /**
        * TODO room for more tests
        */
        //filter out disabled, menu or similar numbers
        if (button.classList.contains('disabled') || isNaN(parseInt(button.id)))
            return null;
        //return the ones which pass above tests
        return button;
    }

};
