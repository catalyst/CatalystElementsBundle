// Path to output distribution files.
const distPath = './dist';

// Path to output tmp files.
const tmpPath = './tmp';

// Path to the CatalystElements.
const catalystElementsPath = './node_modules/@catalyst-elements'

// The name of the bundle.
const bundleName = 'catalyst-elements';

// The name of the analysis file.
const analysisFilename = 'analysis';

// Libraries.
const gulp = require('gulp');
const {Analyzer, generateAnalysis} = require('polymer-analyzer');
const analyzer = Analyzer.createForDirectory('./');
const Builder = require('polymer-build').PolymerProject;
const docBuilder = new Builder(require('./polymer.json'));
const clean = require('gulp-clean');
const closureCompiler = require('google-closure-compiler').gulp();
const concat = require('gulp-concat');
const file = require('gulp-file');
const foreach = require('gulp-foreach');
const fs = require('graceful-fs');
const mergeStream = require('merge-stream');
const stripComments = require('gulp-strip-comments');

/**
 * Convert a class name to an element name.
 *
 * Eg: Foo.BarBaz --> bar-baz
 *
 * @param {string} className
 */
function classNameToElementName(className) {
  return className.substring(className.lastIndexOf('.') + 1).split(/(?=[A-Z])/).join('-').toLowerCase();
}

/**
 * Fix issues with the automatically generated analysis.
 *
 * * @param {object} analysis
 */
function fixAnalysis(analysis) {
  // If `namespaces` is defined.
  if (analysis.namespaces) {
    for (let i = 0; i < analysis.namespaces.length; i++) {
      // For the `CatalystElements` namespace.
      if (analysis.namespaces[i].name === 'CatalystElements') {

        // If `elements` is defined.
        if (analysis.namespaces[i].elements) {
          // For each element.
          for (let j = 0; j < analysis.namespaces[i].elements.length; j++) {

            // If the element's tag name is not set, set it.
            if (analysis.namespaces[i].elements[j].tagname === undefined) {
              analysis.namespaces[i].elements[j].tagname = classNameToElementName(analysis.namespaces[i].elements[j].name);
            }

            // If `demos` is defined.
            if (analysis.namespaces[i].elements[j].demos) {
              // For each demo.
              for (let k = 0; k < analysis.namespaces[i].elements[j].demos.length; k++) {
                // Prefix its url.
                analysis.namespaces[i].elements[j].demos[k].url = `${catalystElementsPath}/${analysis.namespaces[i].elements[j].tagname}/${analysis.namespaces[i].elements[j].demos[k].url}`;
              }
            }

            // Change the path.
            analysis.namespaces[i].elements[j].path = `dist/${bundleName}.js`;

            // If `events` is defined
            if (analysis.namespaces[i].elements[j].events) {
              // For each event.
              for (let k = 0; k < analysis.namespaces[i].elements[j].events.length; k++) {
                // Fix up event descriptions.
                // Remove the name of the event from the beginning of its description.
                analysis.namespaces[i].elements[j].events[k].description = analysis.namespaces[i].elements[j].events[k].description.replace(new RegExp('^' + analysis.namespaces[i].elements[j].events[k].name), '').trim();
              }
            }
          }
        }
      }
    }
  }

  return analysis;
}

// Clean the dist path.
gulp.task('clean-dist', () => {
  return gulp.src(distPath, {read: false, allowEmpty: true}).pipe(clean());
});

// Clean the tmp path.
gulp.task('clean-tmp', () => {
  return gulp.src(tmpPath, {read: false, allowEmpty: true}).pipe(clean());
});

// Build the es6 full version of the components.
gulp.task('build-es6-full', () => {
  return gulp.src(`${catalystElementsPath}/*/src/*.js`)
    .pipe(concat(`${bundleName}.js`))
    .pipe(gulp.dest(tmpPath));
});

// Build the es6 version of the components.
gulp.task('build-es6', () => {
  return gulp.src(`${catalystElementsPath}/*/src/*.js`)
    .pipe(concat(`${bundleName}.js`))
    .pipe(stripComments())
    .pipe(gulp.dest(distPath));
});

// Build the minified es6 version of the components.
gulp.task('build-es6-min', () => {
  return gulp.src(`${distPath}/${bundleName}.js`)
    .pipe(closureCompiler({
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      warning_level: 'QUIET',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT6_STRICT',
      output_wrapper: '(()=>{%output%}).call(this)',
      js_output_file: `${bundleName}.min.js`
    }))
    .pipe(gulp.dest(distPath));
});

// Build the minified es5 version of the components.
gulp.task('build-es5-min', () => {
  return gulp.src(`${distPath}/${bundleName}.js`)
    .pipe(closureCompiler({
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      warning_level: 'QUIET',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT5_STRICT',
      output_wrapper: '(function(){%output%}).call(this)',
      js_output_file: `${bundleName}.es5.min.js`
    }))
    .pipe(gulp.dest(distPath));
});

// Analyze the elements file.
gulp.task('create-analysis', () => {
  return analyzer.analyze([`${tmpPath}/${bundleName}.js`]).then((analysis) => {
    let analysisFileContents = JSON.stringify(fixAnalysis(generateAnalysis(analysis, analyzer.urlResolver)));
    return file(`${analysisFilename}.json`, analysisFileContents, { src: true })
      .pipe(gulp.dest('./'));
  });
});

// Fix node_modules broken link for demos.
gulp.task('demo-dependencies-linker-node-modules', () => {
  return gulp.src([`docs/${catalystElementsPath}/*`, `${catalystElementsPath}/*`])
    .pipe(foreach(function(stream, file){
      return gulp.src('node_modules')
        .pipe(gulp.symlink(file.history[0], {
          relativeSymlinks: true
        }));
    }));
});

// Fix bower_components broken link for demos.
gulp.task('demo-dependencies-linker-bower-components', () => {
  return gulp.src([`docs/${catalystElementsPath}/*`, `${catalystElementsPath}/*`])
    .pipe(foreach(function(stream, file) {
      let src = 'node_modules/@bower_components';
      let dest = `${file.history[0]}/bower_components`;
      if (!fs.existsSync(dest)) {
        fs.symlinkSync(src, dest, 'dir');
      }
      return stream;
    }));
});

// Fix broken links for demos.
gulp.task('demo-dependencies-linker', gulp.series(
  'demo-dependencies-linker-node-modules',
  'demo-dependencies-linker-bower-components'
));

// Build all the components' versions.
gulp.task('build', gulp.series('clean-dist', 'build-es6', gulp.parallel('build-es6-min', 'build-es5-min')));

// Build the docs for all the components' versions.
gulp.task('build-docs', gulp.series('demo-dependencies-linker', () => {
  return mergeStream(docBuilder.sources(), docBuilder.dependencies())
    .pipe(gulp.dest('docs'));
}));

// Analyze all the components.
gulp.task('analyze', gulp.series('build-es6-full', 'create-analysis', 'clean-tmp'));

// Default task.
gulp.task('default', gulp.series('build'));
