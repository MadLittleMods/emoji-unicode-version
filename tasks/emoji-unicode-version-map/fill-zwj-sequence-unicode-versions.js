
const unicodeToName = require('./unicode-to-name');


function fillZwjSequenceUnicodeVersions(emojiMap) {
	Object.keys(emojiMap).forEach((emojiNameKey) => {
		const emoji = emojiMap[emojiNameKey];
		const emojiHexCodePoints = emoji.unicode.split('-');

		// Flags are ZWJ sequences made up of regional indicator symbol letters
		// See http://emojipedia.org/unicode-6.0/
		if (emojiNameKey.indexOf('flag_') === 0) {
			emoji.unicodeVersion = '6.0';
		}
		// If general ZWJ sequence
		else if(!emoji.unicodeVersion && emojiHexCodePoints.length > 1) {
			// Find the emoji of the ZWJ sequence with the highest unicode version
			let unicodeVersionString;
			emojiHexCodePoints.reduce((unicodeVersion, hexCodePoint) => {
				var emojiUnicode = String.fromCodePoint(parseInt(hexCodePoint, 16));
				const emojiNameKey = unicodeToName(emojiUnicode);
				const emoji = emojiMap[emojiNameKey];
				const parsedVersion = emoji && parseFloat(emoji.unicodeVersion);

				if(parsedVersion > unicodeVersion) {
					unicodeVersion = parsedVersion;
					unicodeVersionString = emoji.unicodeVersion;
				}

				return unicodeVersion;
			}, 0);
			emoji.unicodeVersion = unicodeVersionString || false;
		}
	});
}


module.exports = fillZwjSequenceUnicodeVersions;
