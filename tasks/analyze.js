// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const { Analyzer, generateAnalysis } = require('polymer-analyzer');
const file = require('gulp-file');
const glob = require('glob');
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
        analysis.elements[i].path = `${config.bundle.name}.js`;
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
    .src([`./${config.bundle.elementsPath}/catalyst-*/**/*.js`, '!**/*.min*'])
    .pipe(
      rename({
        dirname: '/'
      })
    )
    .pipe(gulp.dest(`./${config.temp.path}/analyze`));
});

// Analyze the elements' files.
gulp.task('create-analysis', done => {
  const analyzer = Analyzer.createForDirectory('./');

  glob(`./${config.temp.path}/analyze/**/*.js`, (err, files) => {
    if (err) {
      throw err;
    }

    analyzer
      .analyze(files)
      .then(analysis => {
        let analysisFileContents = JSON.stringify(
          fixAnalysis(generateAnalysis(analysis, analyzer.urlResolver))
        );
        file(config.docs.analysisFilename, analysisFileContents, {
          src: true
        }).pipe(gulp.dest('./'));
        done();
      })
      .catch(err => {
        done(err);
      });
  });
});

// Analyze the component.
gulp.task(
  'analyze',
  gulp.series('get-elements-for-analysis', 'create-analysis')
);
