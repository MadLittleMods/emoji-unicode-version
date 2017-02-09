const Promise = require('bluebird');
const fs = require('fs-extra');
const readFile = Promise.promisify(fs.readFile);
const outputFile = Promise.promisify(fs.outputFile);
const fetch = require('isomorphic-fetch');
const sanitizeForFileName = require('sanitize-filename');

const scrapeEmojipediaHtml = require('./scrape-emojipedia-html');
const fillZwjSequenceUnicodeVersions = require('./fill-zwj-sequence-unicode-versions');
const emojiMap = require('emojione/emoji.json');


const emojipediaUnicodeVersionUrlMap = {
	'1.1': 'http://emojipedia.org/unicode-1.1/',
	'3.0': 'http://emojipedia.org/unicode-3.0/',
	'3.2': 'http://emojipedia.org/unicode-3.2/',
	'4.0': 'http://emojipedia.org/unicode-4.0/',
	'4.1': 'http://emojipedia.org/unicode-4.1/',
	'5.1': 'http://emojipedia.org/unicode-5.1/',
	'5.2': 'http://emojipedia.org/unicode-5.2/',
	'6.0': 'http://emojipedia.org/unicode-6.0/',
	'6.1': 'http://emojipedia.org/unicode-6.1/',
	'7.0': 'http://emojipedia.org/unicode-7.0/',
	'8.0': 'http://emojipedia.org/unicode-8.0/',
	'9.0': 'http://emojipedia.org/unicode-9.0/',
	'10.0': 'http://emojipedia.org/unicode-10.0/',
	'11.0': 'http://emojipedia.org/unicode-11.0/'
};

const aliasMap = {
	// name: referenceName
	// Commit that changed the name: https://github.com/Ranks/emojione/commit/dbf2df55150fbcce295e480aede2c603fb51ec12
	'large_blue_circle': 'blue_circle',
	// Commit that changed the name: https://github.com/Ranks/emojione/commit/48ab43b4af82f752a84065913ee6b47b01398b86
	'ten': 'keycap_ten'
};


function generateEmojiUnicodeVersionMap() {
	const addingEmojipediaUnicodeVersionPromises = Object.keys(emojipediaUnicodeVersionUrlMap).map((unicodeVersionKey) => {
		console.log(`Working on ${unicodeVersionKey}...`);
		const emojipediaUrl = emojipediaUnicodeVersionUrlMap[unicodeVersionKey];
		const cacheFileName = sanitizeForFileName(emojipediaUrl);
		const cacheFilePath = `./cached-pages/${cacheFileName}.html`;
		// Try to read from the cache
		return readFile(cacheFilePath, 'utf8')
			// Fallback to fetching the page
			.catch(() => {
				return fetch(emojipediaUrl)
					.then((res) => res.text())
					.then((html) => {
						// Save the file as a cache
						outputFile(cacheFilePath, html);
						return html;
					});
			})
			.then((html) => {
				scrapeEmojipediaHtml(emojiMap, html, unicodeVersionKey);
			});
	});

	// Save the transformed emoji map
	const fillingZwjSequencesPromise = Promise.all(addingEmojipediaUnicodeVersionPromises)
		.then(() => {
			console.log('Filling out ZWJ sequences...');
			fillZwjSequenceUnicodeVersions(emojiMap);
		});

	// Setup the legacy aliases
	const addingAliasesPromise = fillingZwjSequencesPromise
		.then(() => {
			Object.keys(aliasMap).forEach((aliasName) => {
				const aliasReferenceName = aliasMap[aliasName];
				emojiMap[aliasName] = Object.assign({}, emojiMap[aliasReferenceName]);
			});
		});

	const ensureAllPopulatedPromise = addingAliasesPromise
		.then(() => {
			// Verify each emoji has a `unicodeVersion`
			let missingVersionCount = 0;
			let notStringVersionCount = 0;
			Object.keys(emojiMap).forEach((emojiNameKey) => {
				const emoji = emojiMap[emojiNameKey];
				if(emoji.unicodeVersion === undefined) {
					console.log(`Missing unicodeVersion property on \`${emojiNameKey}\``);
					missingVersionCount += 1;
				}
				if(typeof emoji.unicodeVersion !== 'string') {
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
		});


	return ensureAllPopulatedPromise.then(() => {
		const emojiToUnicodeVersionMap = {};
		Object.keys(emojiMap).forEach((emojiNameKey) => {
			const emojiInfo = emojiMap[emojiNameKey];
			emojiToUnicodeVersionMap[emojiNameKey] = emojiInfo.unicodeVersion;
			// Also loop through the aliases
			(emojiInfo.aliases || []).forEach((aliasShortName) => {
				const aliasName = aliasShortName.slice(1, aliasShortName.length - 1);
				emojiToUnicodeVersionMap[aliasName] = emojiInfo.unicodeVersion;
			});
		});
		return emojiToUnicodeVersionMap;
	});

}


module.exports = generateEmojiUnicodeVersionMap;
