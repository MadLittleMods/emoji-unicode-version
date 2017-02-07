
const emojiToUnicodeVersionMap = require('./emoji-unicode-version-map.json');

function nameToUnicodeVersion(name) {
	return emojiToUnicodeVersionMap[name];
}

module.exports = nameToUnicodeVersion;
