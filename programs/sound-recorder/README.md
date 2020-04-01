
# ![](../../images/icons/speaker-32x32.png) Sound Recorder

Try it [as part of 98](https://98.js.org/) or [standalone](https://98.js.org/programs/sound-recorder/)

### Extra Features

* The window can be maximized, allowing for a larger slider and waveform display.
  This makes it easier to seek within long audio files, and see quiet audio.

### TODO

* Keep track of file savedness and warn about losing changes

* Integrate with the virtual filesystem

* Insert File & Mix with File

* Clipboard stuff

* Improve keyboard support

* Fix recording over a file (multiple times?)

* Make all error messages visible to the user

* Handle mousewheel for focused slider

* Let buttons take focus from clicking, and focus appropriate buttons when the focused button becomes disabled.
  (Currently space is handled globally to play/pause, which is not how it works.)
  Seek to start should go to seek to end and visa versa, play should go to stop and visa versa, if such buttons are enabled.
  Record should go to stop, and visa versa, which overlaps.
  It might be based on whether it was recording when you press Stop, or what was focused most recently, and that may or may not be a distinction that matters.

* Implement Help > Help Topics

* Audio Properties?
  Make a dialogue with an error icon that says exactly the following:
  ```
  ---------------------------
  Sound - Sound Recorder: SNDREC32.EXE - Ordinal Not Found
  ---------------------------
  The ordinal 379 could not be located in the dynamic link library C:\Windows\SYSTEM32\MMSYS.CPL. 
  ---------------------------
  OK   
  ---------------------------
  ```

* Better echo effect?
  Interpolation for stretching effects?
