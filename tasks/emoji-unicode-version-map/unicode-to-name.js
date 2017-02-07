
const emojione = require('emojione');

function unicodeToName(emojiUnicode) {
	const emojiShortName = emojione.toShort(emojiUnicode);
	const emojiName = emojiShortName.slice(1, emojiShortName.length - 1);
	return emojiName;
}

module.exports = unicodeToName;
