/* eslint-env node */

// Path to output distribution files.
const distPath = './dist';

// Path to output tmp files.
const tmpPath = './tmp';

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
const jsonEditor = require('gulp-json-editor');
const mergeStream = require('merge-stream');
const rename = require('gulp-rename');
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
  return gulp.src('node_modules/@catalyst-elements/*/src/*.js')
    .pipe(concat('catalyst-elements.js'))
    .pipe(gulp.dest(tmpPath));
});

// Build the es6 version of the components.
gulp.task('build-es6', () => {
  return gulp.src('node_modules/@catalyst-elements/*/src/*.js')
    .pipe(concat('catalyst-elements.js'))
    .pipe(stripComments())
    .pipe(gulp.dest(distPath));
});

// Build the minified es6 version of the components.
gulp.task('build-es6-min', () => {
  return gulp.src(distPath + '/catalyst-elements.js')
    .pipe(closureCompiler({
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      warning_level: 'QUIET',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT6_STRICT',
      output_wrapper: '(()=>{\n%output%\n}).call(this)',
      js_output_file: 'catalyst-elements.min.js'
    }))
    .pipe(gulp.dest(distPath));
});

// Build the minified es5 version of the components.
gulp.task('build-es5-min', () => {
  return gulp.src(distPath + '/catalyst-elements.js')
    .pipe(closureCompiler({
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      warning_level: 'QUIET',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT5_STRICT',
      output_wrapper: '(function(){\n%output%\n}).call(this)',
      js_output_file: 'catalyst-elements.es5.min.js'
    }))
    .pipe(gulp.dest(distPath));
});

// Analyze the elements file.
gulp.task('analysis', () => {
  return analyzer.analyze([tmpPath + '/catalyst-elements.js']).then((analysis) => {
    let analysisDocument = JSON.stringify(generateAnalysis(analysis, analyzer.urlResolver));
    return file('analysis.json', analysisDocument, { src: true })
      .pipe(gulp.dest('./'));
  });
});

// Fix node_modules broken link for demos.
gulp.task('demo-dependencies-linker-node-modules', () => {
  return gulp.src(['docs/node_modules/@catalyst-elements/*', 'node_modules/@catalyst-elements/*'])
    .pipe(foreach(function(stream, file){
      return gulp.src('node_modules')
        .pipe(gulp.symlink(file.history[0], {
          relativeSymlinks: true
        }));
    }));
});

// Fix bower_components broken link for demos.
gulp.task('demo-dependencies-linker-bower-components', () => {
  return gulp.src(['docs/node_modules/@catalyst-elements/*', 'node_modules/@catalyst-elements/*'])
    .pipe(foreach(function(stream, file) {
      let src = 'node_modules/@bower_components';
      let dest = file.history[0] + '/bower_components';
      if (!fs.existsSync(dest)) {
        fs.symlinkSync(src, dest, 'dir', () => {});
      }
      return stream;
    }));
});

// Fix broken links for demos.
gulp.task('demo-dependencies-linker', gulp.series(
  'demo-dependencies-linker-node-modules',
  'demo-dependencies-linker-bower-components'
));

// Fix issues with analysis.json
gulp.task('analysis-fixer', () => {
  return gulp.src('./analysis.json')
    .pipe(jsonEditor(function(json) {

      // If `namespaces` is defined.
      if (json.namespaces) {
        for (let i = 0; i < json.namespaces.length; i++) {
          if (json.namespaces[i].name === "CatalystElements") {

            // If `elements` is defined.
            if (json.namespaces[i].elements) {
              // For each class.
              for (let j = 0; j < json.namespaces[i].elements.length; j++) {

                // Figure out the element's tag if it's not set.
                if (json.namespaces[i].elements[j].tagname === undefined) {
                  json.namespaces[i].elements[j].tagname = classNameToElementName(json.namespaces[i].elements[j].name);
                }

                // If `demos` is defined.
                if (json.namespaces[i].elements[j].demos) {
                  // Fix issue with each demo appearing in the demo array twice.

                  // Loop through each demo and save it if it has a url that no previous demo had.
                  let demosObj = {};
                  for (let k = 0; k < json.namespaces[i].elements[j].demos.length; k++) {
                    let url = 'node_modules/@catalyst-elements/' + json.namespaces[i].elements[j].tagname + '/' + json.namespaces[i].elements[j].demos[k].url;
                    if (!demosObj[url]) {
                      json.namespaces[i].elements[j].demos[k].url = url;
                      demosObj[url] = json.namespaces[i].elements[j].demos[k];
                    }
                  }

                  // Convert the demo object into an array.
                  let demosArr = [];
                  for (let demo in demosObj) {
                    demosArr.push(demosObj[demo]);
                  }

                  // Update the array of demos.
                  json.namespaces[i].elements[j].demos = demosArr;
                }

                // Change the path.
                json.namespaces[i].elements[j].path = 'dist/catalyst-elements.js';

                // Fix up event descriptions.
                if (json.namespaces[i].elements[j].events) {
                  for (let k = 0; k < json.namespaces[i].elements[j].events.length; k++) {
                    json.namespaces[i].elements[j].events[k].description = json.namespaces[i].elements[j].events[k].description.replace(new RegExp('^' + json.namespaces[i].elements[j].events[k].name), '').trim();
                  }
                }
              }
            }
          }
        }
      }

      // Return the modified json.
      return json;
    }))
    .pipe(gulp.dest("./"));
});

// Build all the components' versions.
gulp.task('build', gulp.series('clean-dist', 'build-es6', gulp.parallel('build-es6-min', 'build-es5-min')));

// Build all the components' versions.
gulp.task('build-docs', gulp.series('demo-dependencies-linker', () => {
  return mergeStream(docBuilder.sources(), docBuilder.dependencies())
    .pipe(gulp.dest('docs'));
}));

// Analyze all the components.
gulp.task('analyze', gulp.series('build-es6-full', 'analysis', 'clean-tmp', 'analysis-fixer'));

// Default task.
gulp.task('default', gulp.series('build'));
