[![npm](https://img.shields.io/npm/v/emoji-unicode-version.svg?style=flat-square)](https://www.npmjs.com/package/emoji-unicode-version)

# emoji-unicode-version

Get the unicode version for a given emoji name.

Useful for testing native unicode emoji support. Test a single emoji and assume any other emoji with that same version is supported.

```
npm install emoji-unicode-version
```


# Usage

```js
const emojiNameToUnicodeVersion = require('emoji-unicode-version');

// 6.1
console.log(emojiNameToUnicodeVersion('grinning'));
// 9.0
console.log(emojiNameToUnicodeVersion('rofl'));
```

### Get version from unicode

```js
const emojiNameToUnicodeVersion = require('emoji-unicode-version');
const emojione = require('emojione');

function unicodeToName(emojiUnicode) {
	const emojiShortName = emojione.toShort(emojiUnicode);
	const emojiName = emojiShortName.slice(1, emojiShortName.length - 1);
	return emojiName;
}

// grinning, 6.1
console.log(emojiNameToUnicodeVersion(unicodeToName('😀')));
// rofl, 9.0
console.log(emojiNameToUnicodeVersion(unicodeToName('🤣')));
```


# About

Emoji name list is pulled from [EmojiOne](https://github.com/Ranks/emojione)

We  grab the emoji unicode versions from [Emojipedia](http://emojipedia.org/unicode-6.1/).

[ZWJ sequences](http://emojipedia.org/emoji-zwj-sequences/) use the unicode version for the highest individual emoji in the sequence.


Also See

 - http://unicode.org/emoji/charts-beta/full-emoji-list.html
 - http://www.unicode.org/Public/emoji/5.0/emoji-data.txt
 - http://unicode.org/Public/emoji/5.0/emoji-zwj-sequences.txt
