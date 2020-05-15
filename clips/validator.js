var validation = require('./validation.json');
var { getClips } = require('./clipManager');
const ytdl = require('ytdl-core');

function validateKeywords(keywords) {
    //Blocked keywords check
    keywords.forEach((keyword) => {
        if (validation.indexOf(keyword) != -1) return `"${keyword}" is in the blocked keywords list. Please try again.`;
    });

    //Existing keyword check
    getClips().forEach((clip) => {
        clip.keywords.forEach((existingKeyword) => {
            keywords.forEach((newKeyword) => {
                if (existingKeyword == newKeyword) return `"${existingKeyword}" Already exists. Please try again.`;
            });
        });
    });
}

function validateClip(clip, callback) {
    var hasValidated = false;

    //Existing clip check
    getClips().forEach((existingClip) => {
        if (existingClip.clip == clip) {
            if (!hasValidated) {
                hasValidated = true;
                callback(false);
            }
        }
    });

    if (!hasValidated) {
        const video = ytdl(clip);
        video.on('info', (info, format) => {
            console.log(info.player_response.videoDetails.lengthSeconds);
            callback(info.player_response.videoDetails.lengthSeconds <= 15);
        });
    }
}

module.exports = {
    validateKeywords,
    validateClip,
};
