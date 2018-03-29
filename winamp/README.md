
# ![](../images/icons/winamp2-32x32.png) Winamp 2

[Winamp2-js](https://github.com/captbaritone/winamp2-js) by [Jordan Eldredge](https://jordaneldredge.com/)

Try it [as part of 98](http://98.js.org/) or [standalone at webamp.org](http://webamp.org/)


### TODO

* Fix z-indexing with context menu: it uses a fixed z-index and I have an indefinitely incrementing z-index
	* Also see if there are other uses of z-index

* Drag and drop: prevent redirecting the whole page!

* Window blurring (also needed for regular windows!)

* Localize keyboard shortcuts (currently pretty much everything in 98 is in iframes, and I haven't implemented arrow keys for icons on the desktop, so it's hard to tell, and it doesn't matter much, but the keyboard shortcuts should only apply when Winamp is focused - so this depends on window blurring)

* Interop with Sound Recorder should be fun! ;)
