
# ![](../../images/icons/speaker-32x32.png) Sound Recorder

Try it [as part of 98](https://98.js.org/) or [standalone](https://98.js.org/programs/sound-recorder/)

### Extra Features

* The window can be maximized, allowing for a larger slider and waveform display.
  This makes it easier to seek within long audio files, and see quiet audio.

### TODO

* Keep track of whether the file is saved and warn about losing changes

* Integrate with the virtual filesystem

* Insert File & Mix with File

* Clipboard stuff

* Improve keyboard support

* Fix recording over a file (multiple times?)

* Make all error messages visible to the user

* Handle mousewheel for focused slider

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
