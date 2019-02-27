const gulp = require('gulp');
const Promise = require('bluebird');
const fs = require('fs-extra');
const outputFile = Promise.promisify(fs.outputFile);

const generateEmojiUnicodeVersionMap = require('./tasks/emoji-unicode-version-map');

gulp.task('generate-emoji-unicode-version-map', () => {
	return outputFile('./emoji-unicode-version-map.json', JSON.stringify(generateEmojiUnicodeVersionMap(), null, '\t'));
});

gulp.task('build', gulp.series(
	'generate-emoji-unicode-version-map'
));


gulp.task('default', gulp.series(
	'build'
));
