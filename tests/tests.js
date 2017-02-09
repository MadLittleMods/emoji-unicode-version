const test = require('tape');
const yargs = require('yargs');

const nameToUnicodeVersion = require('../');

var opts = yargs
	.option('grep', {
		alias: 'g',
		description: 'Output'
	})
	.help('help')
	.alias('help', 'h')
	.argv;

const grepRe = new RegExp(opts.grep);


let testNameToUnicodeVersion = function(name, inputName, expected) {
	if(!opts.grep || (opts.grep && grepRe.test(name))) {
		test(`generateEmojiUnicodeVersionMap: ${name}`, (t) => {
			t.plan(1);

			t.strictEqual(nameToUnicodeVersion(inputName), expected);
		});
	}
};


testNameToUnicodeVersion('heart', '1.1');
testNameToUnicodeVersion('information_source', '3.0');
testNameToUnicodeVersion('recycle', '3.2');
testNameToUnicodeVersion('zap', '4.0');
testNameToUnicodeVersion('gear', '4.1');
testNameToUnicodeVersion('mahjong', '5.1');
testNameToUnicodeVersion('soccer', '5.2');
testNameToUnicodeVersion('japanese_goblin0', '6.0');
testNameToUnicodeVersion('expressionless', '6.1');
testNameToUnicodeVersion('spy', '7.0');
testNameToUnicodeVersion('metal', '8.0');
testNameToUnicodeVersion('rofl', '9.0');
//testNameToUnicodeVersion('grinning', '10.0');
//testNameToUnicodeVersion('grinning', '11.0');


// Test if the new name and legacy name are available
testNameToUnicodeVersion('blue_circle', '6.0');
testNameToUnicodeVersion('large_blue_circle', '6.0');

// Test if aliases are present
testNameToUnicodeVersion('thumbsup', '6.0');
testNameToUnicodeVersion('thumbup', '6.0');
testNameToUnicodeVersion('+1', '6.0');

testNameToUnicodeVersion('flag_us', '6.0');
