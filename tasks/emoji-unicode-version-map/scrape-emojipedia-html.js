const cheerio = require('cheerio');
const unicodeToName = require('./unicode-to-name');

function scrapeEmojipediaHtml(emojiMap, html, unicodeVersion) {
	const $ = cheerio.load(html);
	$('.container .content li')
		.each((index, el) => {
			const $el = $(el);
			const emojiUnicodeEl = $el.find('.emoji');
			if(emojiUnicodeEl.length) {
				// Get rid of the emoji presentation selectors U+FE0F at the end
				const emojiUnicode = emojiUnicodeEl.text().replace(/(\uFE0F)+$/g, '');
				const emojiNameKey = unicodeToName(emojiUnicode);
				if(emojiMap[emojiNameKey]) {
					emojiMap[emojiNameKey].unicodeVersion = unicodeVersion;
				}
			}
		});
}


module.exports = scrapeEmojipediaHtml;
