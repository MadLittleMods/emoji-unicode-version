const emojioneMap = require('emojione/emoji.json');

const aliasMap = {
	// name: referenceName
	// Commit that changed the name: https://github.com/Ranks/emojione/commit/dbf2df55150fbcce295e480aede2c603fb51ec12
	'large_blue_circle': 'blue_circle',
	// Commit that changed the name: https://github.com/Ranks/emojione/commit/48ab43b4af82f752a84065913ee6b47b01398b86
	'ten': 'keycap_ten',
	// Tone variants removed in Emojione 3+
	'wrestlers_tone1': 'wrestlers',
	'wrestling_tone1': 'wrestling',
	'wrestlers_tone2': 'wrestlers',
	'wrestling_tone2': 'wrestling',
	'wrestlers_tone3': 'wrestlers',
	'wrestling_tone3': 'wrestling',
	'wrestlers_tone4': 'wrestlers',
	'wrestling_tone4': 'wrestling',
	'wrestlers_tone5': 'wrestlers',
	'wrestling_tone5': 'wrestling',
	'handshake_tone1': 'handshake',
	'shaking_hands_tone1': 'shaking_hands',
	'handshake_tone2': 'handshake',
	'shaking_hands_tone2': 'shaking_hands',
	'handshake_tone3': 'handshake',
	'shaking_hands_tone3': 'shaking_hands',
	'handshake_tone4': 'handshake',
	'shaking_hands_tone4': 'shaking_hands',
	'handshake_tone5': 'handshake',
	'shaking_hands_tone5': 'shaking_hands',
};


function generateEmojiUnicodeVersionMap() {
	const emojiToUnicodeVersionMap = {};

	Object.keys(emojioneMap).forEach((emojioneKey) => {
		const emoji = emojioneMap[emojioneKey];

		const emojiShortName = emoji.shortname;
		const emojiNameKey = emojiShortName.slice(1, emojiShortName.length - 1);

		const unicodeVersion = emoji.unicode_version.toFixed(1);

		if (emoji.unicode_version !== parseFloat(unicodeVersion)) {
			throw new Error(`Unsupported Unicode version ${emoji.unicode_version}`);
		}

		emojiToUnicodeVersionMap[emojiNameKey] = unicodeVersion;

		// Also loop through the aliases
		(emoji.shortname_alternates || []).forEach((aliasShortName) => {
			const aliasName = aliasShortName.slice(1, aliasShortName.length - 1);
			emojiToUnicodeVersionMap[aliasName] = unicodeVersion;
		});
	});

	// Setup the legacy aliases
	Object.keys(aliasMap).forEach((aliasName) => {
		const aliasReferenceName = aliasMap[aliasName];
		emojiToUnicodeVersionMap[aliasName] = emojiToUnicodeVersionMap[aliasReferenceName];
	});

	let missingVersionCount = 0;
	let notStringVersionCount = 0;

	Object.keys(emojiToUnicodeVersionMap).forEach((emojiNameKey) => {
		const version = emojiToUnicodeVersionMap[emojiNameKey];

		if(version === undefined) {
			console.log(`Missing unicodeVersion property on \`${emojiNameKey}\``);
			missingVersionCount += 1;
		}
		if(typeof version !== 'string') {
			console.log(`Invalid unicodeVersion property, must be string on \`${emojiNameKey}\``);
			notStringVersionCount += 1;
		}
	});
	if(missingVersionCount > 0) {
		throw new Error(`Missing unicodeVersion property on ${missingVersionCount} emojis`);
	}
	if(notStringVersionCount > 0) {
		throw new Error(`unicodeVersion property not a string for ${notStringVersionCount} emojis`);
	}

	return emojiToUnicodeVersionMap;
}


module.exports = generateEmojiUnicodeVersionMap;
