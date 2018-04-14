
# ![](../../images/icons/winamp2-32x32.png) Winamp 2.9

[Webamp](https://github.com/captbaritone/webamp) by [Jordan Eldredge](https://jordaneldredge.com/)

Try it [on 98.js.org](https://98.js.org/) or [standalone at webamp.org](https://webamp.org/)


### TODO

* Title of the window in the taskbar (basically what's listed in the playlist window, and `- Winamp 2.91`, as well as `[Stopped]` when stopped, `[Paused]` when paused... by default just `Winamp 2.91`)

* Fix z-indexing with context menu: it uses a fixed z-index and I have an indefinitely incrementing z-index
	* Also see if there are other uses of z-index

* Window blurring (also needed for regular windows!)

* Localize keyboard shortcuts (currently pretty much everything in 98.js uses iframes, and I haven't implemented arrow keys for icons on the desktop, so it's hard to tell, and it doesn't matter much (yet), but the keyboard shortcuts should only apply when Winamp is focused - so this depends on window blurring)

* Interop with Sound Recorder should be fun! ;)

* Touchscreen window movement

* Include more skins? Having a catalog would be nice...
