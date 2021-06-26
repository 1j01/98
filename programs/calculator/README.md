# ![](../../images/icons/calculator-32x32.png) Calculator

Remake of the Windows 98 Calculator program for the web, using the [open sourced Windows 10 calculator](https://github.com/microsoft/calculator) engine, [ported to the web](https://github.com/muzam1l/mcalculator) by [muzamil](https://github.com/muzam1l).

Try it [as part of 98](https://98.js.org/) or [standalone](https://98.js.org/programs/calculator/)

## TODO


improvements to port upstream:
- fixed subtract key typo and thus behavior
- fixed lots of spelling
- click history and memory items to re-enter that input
- copy and paste
- prevent triggering focused button at the same time as Equals function when pressing Enter
- prevent opening Quick Find in Firefox when pressing slash
- handle M+ pressed before MS

bugs:
- (I changed the #primary el to an input and changed the script.js to handle that forgetting about supporting the old version)
- is there a race condition where script.js loads to late to define initialise for engine.js to call? or is order guaranteed even with async somehow? is async really helping? probably not
- memory-item btns aren't buttons (and nesting buttons doesn't work in HTML and is a bad UI pattern)
- MR (memory recall) button doesn't work
- MS after MC doesn't show memory stored, until you press it N times, where N increases if you repeat this
- Edit > Copy and Paste don't work in 98.js desktop in Firefox because the "page isn't focused"


todo:
- Convert help topics (and automate the conversion/cleanup of HTML!) (I already have a help viewer)
- Left arrow should be equivalent to backspace
- for mcalculator, woff in addition to ttf (could steal from uno or convert from ttf), for 98.js.org, remove font and use shitty ASCII representation..?
- drop commit with auto-run
- squash stuff
- Improve Copy/Paste function availability using older clipboard access APIs?
- remove focus indicators
- use disabled attribute
- increase limit of digits you can enter, as it was longer in old Windows

