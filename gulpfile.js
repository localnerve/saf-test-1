const assert = require('node:assert');
const fs = require('node:fs/promises');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const { default: sassAssetFunctions } = require('@localnerve/sass-asset-functions');

gulp.task('images', () => {
  return gulp.src(['img/**'])
    .pipe(gulp.dest('dist/img'));
});

gulp.task('sass', () => {
  return gulp.src(['sass/**/*.scss'])
    .pipe(sass({
      precision: 10,
      outputStyle: 'expanded',
      includePaths: [
        'node_modules/modern-normalize'
      ],
      // importer: compassImporter,
      functions: sassAssetFunctions({
        images_path: 'img',
        http_images_path: '/img'
      })
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('verify', async () => {
  const cssBuffer = await fs.readFile('dist/index.css');
  const cssText = cssBuffer.toString();
  const re = /width\:\s*(?<width>\d+)/mg;
  const results = re.exec(cssText);
  const width = results?.groups?.width;
  assert.ok(width === '400');
  console.log(`OK: width === '${width}'`);
});