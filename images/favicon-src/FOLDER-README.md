# Favicon Source Files

Some favicon resources (`apple-touch-icon.png` etc.) were generated with https://realfavicongenerator.net

The `faviconDescription.json` was taken from the output of that tool, and they describe how to use it seemingly only on that results page,
so for posterity, that is:

1. Install cli-real-favicon: `npm install -g cli-real-favicon`

2. Create a file named `faviconDescription.json` and populate it with: &lt;the contents that are in that file except with the master picture path replaced&gt;

3. In the code above, replace `TODO: Path to your master picture` with the path of your master picture. For example, `assets/images/master_picture.png`.

4. Generate your icons:
	```
	mkdir outputDir
	real-favicon generate faviconDescription.json faviconData.json outputDir
	```

5. Inject the HTML code in your pages:
	```
	real-favicon inject faviconData.json outputDir htmlFiles/*.html
	```

6. Check for updates (to be run from time to time, ideally by your continuous integration system):
	```
	real-favicon check-for-update --fail-on-update faviconData.json
	```

The contents of that file don't necessarily match what I eventually went with, tho.
I didn't use it, I just downloaded the package and used it as a scaffolding, editing the results manually.

realfavicongenerator.net uses Potrace to generate a Safari pinned tab icon, but this wasn't good for the pixel art of the retro icons,
so I made `safari-pinned-tab-16x16.png` and passed it into http://www.drububu.com/tutorial/bitmap-to-vector.html
using the "export as SVG, no overlapping areas" option which appears as just a second ".svg" option, and set to 2 colors,
and removed the lines with a white fill (`fill="rgb(255,255,255)"`)

I also had to use a separate PNG to ICO service just to make the basic favicon.ico, as realfavicongenerator.net only supports sizing down from a large image
