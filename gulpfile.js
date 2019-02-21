const gulp = require('gulp');
const Promise = require('bluebird');
const fs = require('fs-extra');
const eslint = require('gulp-eslint');
const outputFile = Promise.promisify(fs.outputFile);

const generateEmojiUnicodeVersionMap = require('./tasks/emoji-unicode-version-map');


gulp.task('lint-js', () => {
	return gulp.src(['**/*.js', '!node_modules/**'])
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
    .pipe(eslint.format());
});


gulp.task('lint', gulp.series(
	'lint-js'
));


gulp.task('generate-emoji-unicode-version-map', () => {
	return outputFile('./emoji-unicode-version-map.json', JSON.stringify(generateEmojiUnicodeVersionMap(), null, '\t'));
});

gulp.task('build', gulp.series(
	'generate-emoji-unicode-version-map'
));


gulp.task('default', gulp.series(
	'lint',
	'build'
));
