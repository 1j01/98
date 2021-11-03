#!/bin/bash
# requires: imagemagick

# DETERMINE THE SCRIPT'S DIRECTORY
pushd . > /dev/null
SCRIPT_PATH="${BASH_SOURCE[0]}";
if ([ -h "${SCRIPT_PATH}" ]) then
  while([ -h "${SCRIPT_PATH}" ]) do cd `dirname "$SCRIPT_PATH"`; SCRIPT_PATH=`readlink "${SCRIPT_PATH}"`; done
fi
cd `dirname ${SCRIPT_PATH}` > /dev/null
SCRIPT_PATH=`pwd`;
popd  > /dev/null

# why is that so complicated?

icons_dir="$SCRIPT_PATH/images/icons"
extract_ico () {
	icon_name="$(basename -s .ico "$1")"
	convert "$1" -set filename:mysizeanddepth '%wx%h-%[bit-depth]bpp' "$icons_dir/$icon_name-%[filename:mysizeanddepth].png"
	echo Extracted "$1"
}
for fname in "$@"; do
	extract_ico "$fname"
done
