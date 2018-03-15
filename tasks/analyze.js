// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const { Analyzer, generateAnalysis } = require('polymer-analyzer');
const file = require('gulp-file');
const globby = require('globby');
const rename = require('gulp-rename');

/**
 * Fix issues with the automatically generated analysis.
 *
 * * @param {object} analysis
 */
function fixAnalysis(analysis) {
  // If `elements` is defined.
  if (analysis.elements) {
    // For each element.
    for (let i = 0; i < analysis.elements.length; i++) {
      // If the element's path starts with tmp, change it to be the dist bundle.
      if (
        analysis.elements[i].path &&
        analysis.elements[i].path.indexOf('tmp/') === 0
      ) {
        analysis.elements[i].path = `${config.dist.path}/${
          config.bundle.name
        }.js`;
      }

      // If `demos` is defined.
      if (analysis.elements[i].demos) {
        // For each demo.
        for (let j = 0; j < analysis.elements[i].demos.length; j++) {
          // Prefix its url.
          analysis.elements[i].demos[j].url = `../${
            analysis.elements[i].tagname
          }/${analysis.elements[i].demos[j].url}`;
        }
      }
    }
  }

  return analysis;
}

// Copy all the elements over to the temp folder for analysis.
gulp.task('get-elements-for-analysis', () => {
  return gulp
    .src([
      `./${config.bundle.elementsPath}/*/${config.dist.path}/**/*.js`,
      '!**/*.min*'
    ])
    .pipe(
      rename({
        dirname: '/'
      })
    )
    .pipe(gulp.dest(`./${config.temp.path}/elements`));
});

// Analyze the elements' files.
gulp.task('create-analysis', async () => {
  const analyzer = Analyzer.createForDirectory('./');

  await globby(`./${config.temp.path}/elements/**/*.js`)
    .then(elements => {
      return analyzer.analyze(elements);
    })
    .then(analysis => {
      let analysisFileContents = JSON.stringify(
        fixAnalysis(generateAnalysis(analysis, analyzer.urlResolver))
      );
      return file(config.docs.analysisFilename, analysisFileContents, {
        src: true
      }).pipe(gulp.dest('./'));
    });
});

// Analyze the component.
gulp.task(
  'analyze',
  gulp.series('get-elements-for-analysis', 'create-analysis', 'clean-tmp')
);
