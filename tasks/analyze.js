// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const {Analyzer, generateAnalysis} = require('polymer-analyzer');
const deepmerge = require('deepmerge');
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
      if (analysis.elements[i].path && analysis.elements[i].path.indexOf('tmp/') === 0) {
        analysis.elements[i].path = `${config.dist.path}/${config.bundle.name}.js`;
      }

      // If `demos` is defined.
      if (analysis.elements[i].demos) {
        // For each demo.
        for (let j = 0; j < analysis.elements[i].demos.length; j++) {
          // Prefix its url.
          analysis.elements[i].demos[j].url = `../${analysis.elements[i].tagname}/${analysis.elements[i].demos[j].url}`;
        }
      }
    }
  }

  return analysis;
}

// Analyze the elements file.
gulp.task('create-analysis', gulp.series(() => {
  return gulp.src([`${config.bundle.elementsPath}/*/${config.dist.path}/*.js`, '!**/*.min*'])
    .pipe(rename({
      dirname: '/'
    }))
    .pipe(gulp.dest(`./${config.temp.path}/elements`));
}, async () => {
  const catalystElements = await globby(`./${config.temp.path}/elements`);
  const analyses = [];

  for (let i = 0; i < catalystElements.length; i++) {
    const analyzer = Analyzer.createForDirectory('./');
    await analyzer.analyze([catalystElements[i]]).then((analysis) => {
      analyses.push(fixAnalysis(generateAnalysis(analysis, analyzer.urlResolver)));
    });
  }

  const fullAnalysis = deepmerge.all.call(this, analyses);
  const analysisFileContents = JSON.stringify(fullAnalysis);

  return file(config.docs.analysisFilename, analysisFileContents, { src: true })
    .pipe(gulp.dest('./'));
}));

// Analyze all the components.
gulp.task('analyze', gulp.series('create-analysis', 'clean-tmp'));
