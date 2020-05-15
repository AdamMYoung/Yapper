var fs = require('fs');
var path = require('path');

/**
 * Reads the clips saved in the local commands.json path, or the provided path if overridden.
 * @param url URL of the clips.
 * @returns {Object[]}
 */
function getClips() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../commands.json')));
}

/**
 * Adds the provided keyword and clip to the local storage if they pass validation.
 * @param {string[]} keywords Keywords to trigger the clip
 * @param {string} clip Clip to play for the provided keyword.
 * @returns {boolean}
 */
function addEntry(keywords, clip) {
    const clips = getClips();
    clips.push({ keywords: keywords, clip: clip });
    fs.writeFileSync(path.join(__dirname, '../commands.json'), JSON.stringify(clips));
}

module.exports = {
    getClips,
    addEntry,
};
