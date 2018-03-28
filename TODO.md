
# ![](images/icons/shutdown-32x32.png) Todo

* Link to the repo from within the app, not just in a text file

* Start Menu

* Unfocused window state

* Reliably focus window contents (i.e. for keyboard shortcuts in Paint)

* File save and open dialogs

* Integrate [winamp2-js](https://github.com/captbaritone/winamp2-js)

* Integrate [js-solitaire](https://github.com/uzi88/js-solitaire)

* Integrate Minesweeper better (i.e. with menus)

* Integrate Paint better

	* Windows that pop out; will need to display graphics via data URIs or canvases, and rely on inline and/or scoped styles

		* Could *maybe* use [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base) for `<img>`s, but all styles (that aren't shared) would have to be inline, and I think it would be better just to try to make everything canvases

	* Can't focus the window because mousedown is prevented; should focus the body or something rather than just blurring or canceling the event

	* Can't drag outside of the window bounds when drawing or making a selection
	([`setCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/setCapture) could make this work)

* Integrate [Pipes screensaver](https://github.com/1j01/pipes)

* Integrate Blue Screen of Death similar to http://fakebsod.com/generic

	* Press <kbd>~</kbd> or something to bluescreen

	* Prankily wait for next user input before fullscreening and bluescreening

* Try integrating arbitrary applications by emulating Windows 98 on the webpage [with v86](https://github.com/copy/v86/blob/master/docs/api.md),
with an X server installed in the VM, and acting as an X client externally??
And integrating a virtual filesystem??
That would be undoubtedly cool, but idk how hard it might be,
and especially what data channels are available between the VM and the host.
Partially [inspired by OS.js](https://www.youtube.com/watch?v=c0safRR0ldM&index=16&list=PL74DE0E481419C259).
