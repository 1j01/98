var copy = require('recursive-copy');
var rimraf = require('rimraf');
var child_process = require('child_process');

// TODO: don't assume jspaint exists at ../jspaint
// TODO: use git subtree or something instead

// TODO: --force option or something
// (you can comment this part out to work on this script)
var output = child_process.execSync("git status --porcelain");
if (output.length) {
	console.error("Working directory must be clean!");
	return;
}

var output = child_process.execSync("cd ../jspaint && git status --porcelain");
if (output.length) {
	console.error("Working directory of ../jspaint must be clean!");
	return;
}

var current_branch = child_process.execSync("cd ../jspaint && git rev-parse --abbrev-ref HEAD").toString().trim();
if (current_branch !== "master") {
	console.error("Git repository at ../jspaint must be on branch master! (currently " + current_branch + ")");
	return;
}
// TODO: could automatically switch branches and back
// TODO: make sure repo doesn't have commits to push

console.log("Running `git pull` in ../jspaint");
// TODO: capture and indent stderr output (could use indent-stream / wrapline)
var output = child_process.execSync("cd ../jspaint && git pull");
console.log(("\n" + output.toString()).replace(/\n/g, "\n  "));

var commit_hash = child_process.execSync("cd ../jspaint && git rev-parse HEAD").toString();

console.log('Recursively deleting programs/jspaint');
rimraf('programs/jspaint', function (err) {
	if (err) {
		throw err;
	}
	console.log('Recursively copying ../jspaint to programs/jspaint');
	copy('../jspaint', 'programs/jspaint', {
		dot: true,
		filter: [
			'**',
			'!node_modules/**',
			'!.git/**',
			'!out/**'
		]
	},
		function (error, results) {
			if (error) {
				console.error('Copy failed: ' + error);
			} else {
				console.info('Copied ' + results.length + ' files');

				// This fixes leaving a file (with a large diff? is that related?) behind (somehow)
				// It seems likely to be a race condition, and a bit of a Heisenbug in that I tried to add this for debug info
				// Likely other things would work, like a setTimeout
				var git_status_output = child_process.execSync("git status");
				// console.log(git_status_output.toString());
				
				// TODO: capture and indent stderr output (could use indent-stream / wrapline)
				var output = child_process.execSync(
					`git add --all programs/jspaint && git commit --message "Update jspaint" --message "To https://github.com/1j01/jspaint/tree/${commit_hash}"`
				);
				console.log(("\n" + output.toString()).replace(/\n/g, "\n  "));
			}
		}
	);
});
