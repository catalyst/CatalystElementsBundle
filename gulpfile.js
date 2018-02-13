// Path to the source files.
const srcPath = './src';

// Path to output distribution files.
const distPath = './dist';

// Path to output tmp files.
const tmpPath = './tmp';

// Path to output the docs too.
const docsPath = './docs';

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
const del = require('del');
const closureCompiler = require('google-closure-compiler').gulp();
const concat = require('gulp-concat');
const escodegen = require('escodegen');
const esprima = require('esprima');
const file = require('gulp-file');
const foreach = require('gulp-foreach');
const mergeStream = require('merge-stream');
const modifyFile = require('gulp-modify-file');
const path = require('path');
const rename = require('gulp-rename');
const stripComments = require('gulp-strip-comments');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

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

// Workaround for: https://github.com/google/closure-compiler/issues/2182
function adjustWebpackBuildForClosureCompiler() {
  return modifyFile((content) => {
    let parsed = esprima.parseModule(content, {}, (node) => {
      if (Array.isArray(node.body)) {
        let toInsert = {};
        for (let i = 0; i < node.body.length; i++) {
          if (node.body[i].type === 'ClassDeclaration') {
            // Extends webpack module?
            if (node.body[i].superClass !== null && node.body[i].superClass.type === 'MemberExpression' && node.body[i].superClass.object && node.body[i].superClass.object.name.startsWith('__WEBPACK_IMPORTED_MODULE_')) {
              let workaroundVarName = `workaround_var${node.body[i].superClass.object.name}`;
              toInsert[i] = esprima.parseScript(`let ${workaroundVarName} = ${node.body[i].superClass.object.name}[${node.body[i].superClass.property.raw}];`);

              node.body[i].superClass = {
                type: 'Identifier',
                name: workaroundVarName
              };
            }
          }
        }
        for (let i in toInsert) {
          node.body.splice(i, 0, toInsert[i]);
        }
      }
    });
    content = escodegen.generate(parsed);

    return content;
  });
}

// Get all the static imports in a JS file.
function getStaticImports(js) {
  let parsed = esprima.parseModule(js);
  let imports = [];

  // Get all the imports
  for (let i = 0; i < parsed.body.length; i++) {
    if (parsed.body[i].type === 'ImportDeclaration') {
      for (let j = 0; j < parsed.body[i].specifiers.length; j++) {
        if (parsed.body[i].specifiers[j].type === 'ImportSpecifier') {
          if (parsed.body[i].specifiers[j].local.type === 'Identifier') {
            imports.push(parsed.body[i].specifiers[j].local.name);
          }
        }
      }
    }
  }

  return imports;
}

// Clean the dist path.
gulp.task('clean-dist', (done) => {
  del(distPath).then(() => { done(); });
});

// Clean the tmp path.
gulp.task('clean-tmp', (done) => {
  del(tmpPath).then(() => { done(); });
});

// Clean the docs path.
gulp.task('clean-docs', (done) => {
  del(docsPath).then(() => { done(); });
});

// Remove `node_modules` folder in catalyst elements.
gulp.task('clean-elements', (done) => {
  del(`${catalystElementsPath}/*/node_modules`).then(() => { done(); });
});

// Build the components with comments for analysis.
// Note: HTML and CSS are not inject.
gulp.task('build-for-analysis', () => {
  return gulp.src([`${catalystElementsPath}/*/dist/*.js`, '!**/*.min*', '!**/*.es5*', '!**/*.module*'])
    .pipe(concat(`${bundleName}-analysis.js`))
    .pipe(gulp.dest(tmpPath));
});

// Build the module version of the components.
gulp.task('build-module', () => {
  return gulp.src(`${srcPath}/${bundleName}.js`)
    .pipe(stripComments())
    .pipe(modifyFile((content) => {
      let imports = getStaticImports(content);

      content = content.replace(/\.\.\/node_modules\/@catalyst-elements\//g, '../../');

      // Add a comment to the top of the file.
      content = '// Import the catalyts elements.\n' + content;

      // Create a function to register all the imported elements.
      content = content + '\n/**\n * Register all the elements in this bundle.\n */\n';
      content = content + 'function registerCatalystElements() {\n';
      for (let i = 0; i < imports.length; i++) {
        content = `${content}  ${imports[i]}.register();\n`;
      }
      content = content + '}\n';

      // The things to export.
      let exports = [
        'registerCatalystElements'
      ].concat(imports);

      // Export all the things.
      content = content + '\n// Export all the catalyst elements and the `registerCatalystElements` function.\n';
      content = content + 'export {\n  ' + exports.join(',\n  ') + '\n};\n'

      return content;
    }))
    .pipe(rename({
      basename: bundleName,
      extname: '.module.js'
    }))
    .pipe(gulp.dest(distPath));
});

// Create the file to be built into the es6 version of the components.
gulp.task('prebuild-es6', () => {
  return gulp.src(`${srcPath}/${bundleName}.js`)
    .pipe(modifyFile((content) => {
      let imports = getStaticImports(content);

      let registerElements = '';
      for (let i = 0; i < imports.length; i++) {
        registerElements = `${registerElements}
    // Make the ${imports[i]} class globally accessible under the \`CatalystElements\` object and register it.
    window.CatalystElements.${imports[i]} = ${imports[i]};
    ${imports[i]}.register();
`
      }
      registerElements = registerElements.trim();

      content = `${content}

(() => {
  /**
   * Namespace for all the Catalyst Elements.
   *
   * @namespace CatalystElements
   */
  window.CatalystElements = window.CatalystElements || {};

  /**
   * Create the custom elements.
   */
  function registerElements() {
    ${registerElements}
  }


  // If not using web component polyfills or if polyfills are ready, register the elements.
  if (window.WebComponents === undefined || window.WebComponents.ready) {
    registerElements();
  }
  // Otherwise wait until the polyfills are ready.
  else {
    window.addEventListener('WebComponentsReady', () => {
      registerElements();
    });
  }
})();`

      return content;
    }))
    .pipe(gulp.dest(tmpPath));
});

// Build the es6 version of the components.
gulp.task('build-es6', () => {
    return gulp.src(`${tmpPath}/${bundleName}.js`)
    .pipe(webpackStream({
      target: 'web'
    }, webpack))
    .pipe(rename({
      basename: bundleName,
      extname: '.js'
    }))
    .pipe(gulp.dest(distPath));
});

// Build the minified es6 version of the components.
gulp.task('build-es6-min', () => {
  return gulp.src(`${distPath}/${bundleName}.js`)
    .pipe(adjustWebpackBuildForClosureCompiler())
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
    .pipe(adjustWebpackBuildForClosureCompiler())
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
  return analyzer.analyze([`${tmpPath}/${bundleName}-analysis.js`]).then((analysis) => {
    let analysisFileContents = JSON.stringify(fixAnalysis(generateAnalysis(analysis, analyzer.urlResolver)));
    return file(`${analysisFilename}.json`, analysisFileContents, { src: true })
      .pipe(gulp.dest('./'));
  });
});

// Clone all the dependencies needed for docs.
gulp.task('docs-clone-dependencies', () => {
  return gulp.src([
    'node_modules/**',
    'index.html'
  ], { follow: true, base: './' }).pipe(gulp.dest(`${tmpPath}`));
});

// Fix links for the docs.
gulp.task('docs-fix-links', () => {
  return gulp.src(`${tmpPath}/${catalystElementsPath}/*/demo/**/*[.html|.js]`, { base: tmpPath })
    .pipe(modifyFile((content) => {
      return content.replace(/\.\.\/node_modules\//g, '../../../');
    }))
    .pipe(gulp.dest(tmpPath));
});

// Build the iron-component-page.
gulp.task('docs-build-iron-component-page', () => {
  return gulp.src(`${tmpPath}/node_modules/@polymer/iron-component-page/iron-component-page.js`, { base: tmpPath })
    .pipe(webpackStream({
      target: 'web'
    }, webpack))
    .pipe(adjustWebpackBuildForClosureCompiler())
    .pipe(closureCompiler({
      compilation_level: 'SIMPLE_OPTIMIZATIONS',
      warning_level: 'QUIET',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT6_STRICT'
    }))
    .pipe(rename({
      basename: 'iron-component-page',
      extname: '.build.js'
    }))
    .pipe(gulp.dest(`${tmpPath}`));
});

// Build the imports for each demo.
gulp.task('docs-build-demo-imports', () => {
  return gulp.src(`${tmpPath}/${catalystElementsPath}/*/demo/import.js`)
    .pipe(foreach(function(stream, file) {
      return stream
      .pipe(webpackStream({
        target: 'web'
      }, webpack))
      .pipe(adjustWebpackBuildForClosureCompiler())
      .pipe(closureCompiler({
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        warning_level: 'QUIET',
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ECMASCRIPT6_STRICT'
      }))
      .pipe(rename({
        basename: 'import',
        extname: '.build.js'
      }))
      .pipe(gulp.dest(path.dirname(file.path)));
    }));
});

// Update the imports in the index.
gulp.task('docs-update-index-imports', () => {
  return gulp.src(`${tmpPath}/index.html`)
    .pipe(modifyFile((content) => {
      return content.replace(new RegExp('<script src="node_modules/@polymer/iron-component-page/iron-component-page.js" type="module"></script>'), '<script src="iron-component-page.build.js"></script>');
    }))
    .pipe(gulp.dest(tmpPath));
});

// Update the imports in the demos.
gulp.task('docs-update-demo-imports', () => {
  return gulp.src(`${tmpPath}/${catalystElementsPath}/*/demo/*.html`, { base: tmpPath })
    .pipe(modifyFile((content) => {
      return content.replace(new RegExp('<script src="import.js" type="module"></script>'), '<script src="../../../marked/marked.min.js"></script><script src="import.build.js"></script>');
    }))
    .pipe(gulp.dest(tmpPath));
});

// Generate the docs.
gulp.task('docs-generate', gulp.series(() => {
  const docBuilder = new Builder(require('./polymer.json'));
  return mergeStream(docBuilder.sources(), docBuilder.dependencies())
    .pipe(gulp.dest(docsPath));
}, () => {
  return gulp.src(`${docsPath}/${tmpPath}/**`)
    .pipe(gulp.dest(docsPath));
}, (done) => {
  del(`${docsPath}/${tmpPath}/`).then(() => {
    done();
  });
}));

// Build all the components' versions.
gulp.task('build', gulp.series('clean-dist', gulp.parallel('build-module', 'prebuild-es6'), 'build-es6', gulp.parallel('build-es6-min', 'build-es5-min'), 'clean-tmp'));

// Build the docs for all the components' versions.
gulp.task('build-docs', gulp.series(
  'clean-docs',
  'clean-elements',
  'docs-clone-dependencies',
  'docs-fix-links',
  'docs-build-iron-component-page',
  'docs-build-demo-imports',
  'docs-update-index-imports',
  'docs-update-demo-imports',
  'docs-generate',
  'clean-tmp'));

// Analyze all the components.
gulp.task('analyze', gulp.series('build-for-analysis', 'create-analysis', 'clean-tmp'));

// Default task.
gulp.task('default', gulp.series('build'));
