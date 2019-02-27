const fs = require('fs');

const argv = require('yargs/yargs')(process.argv.slice(2)).argv;

const currentMap = require('../emoji-unicode-version-map.json');

const oldMap = JSON.parse(fs.readFileSync(argv._[0], {encoding: 'utf-8'}));

let missingNames = 0;
let changes = 0;

Object.keys(oldMap).forEach((emojiName) => {
	const version = currentMap[emojiName];

	if (version === undefined) {
		console.log(`Missing version for \`${emojiName}\`. Was ${oldMap[emojiName]} previously.`);
		missingNames++;
	} else if (version !== oldMap[emojiName]) {
		console.log(`Changed version for \`${emojiName}\` from ${oldMap[emojiName]} to ${version}.`);
		changes++;
	}
});

console.log('');
console.log('Summary:');
console.log(`- missing ${missingNames} emojis`);
console.log(`- version changes for ${changes} emojis`);

if(missingNames > 0) {
	process.exitCode = 1;
}
