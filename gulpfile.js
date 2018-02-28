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
const Builder = require('polymer-build').PolymerProject;
const del = require('del');
const deepmerge = require('deepmerge');
const esprima = require('esprima');
const file = require('gulp-file');
const foreach = require('gulp-foreach');
const fs = require('graceful-fs');
const globby = require('globby');
const inject = require('gulp-inject');
const mergeStream = require('merge-stream');
const modifyFile = require('gulp-modify-file');
const named = require('vinyl-named');
const path = require('path');
const rename = require('gulp-rename');
const stripComments = require('gulp-strip-comments');
const through = require('through2');
const webpack = require('webpack');
const webpackClosureCompilerPlugin = require('webpack-closure-compiler');
const webpackStream = require('webpack-stream');

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

/**
 * Transform function that returns the contents of the given file.
 *
 * @param {string} filePath
 * @param {File} file
 */
function transformGetFileContents(filePath, file) {
  return file.contents.toString('utf8');
}

// Get all the static imports in a JS file.
function getStaticImports(js) {
  let parsed = esprima.parseModule(js);
  let imports = [];

  // Get all the imports
  for (let i = 0; i < parsed.body.length; i++) {
    if (parsed.body[i].type === 'ImportDeclaration') {
      for (let j = 0; j < parsed.body[i].specifiers.length; j++) {
        if (parsed.body[i].specifiers[j].type === 'ImportDefaultSpecifier' || parsed.body[i].specifiers[j].type === 'ImportSpecifier') {
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
 gulp.task('clean-dist', async () => {
  await del(distPath);
});

  // Clean the tmp path.
gulp.task('clean-tmp', async () => {
  await del(tmpPath);
});

  // Clean the docs path.
gulp.task('clean-docs', async () => {
  await del(docsPath);
});

// Build the es6 module version of the components.
gulp.task('build-module', () => {
  return gulp.src(`${srcPath}/${bundleName}.js`)
    .pipe(stripComments())
    .pipe(modifyFile((content) => {
      let imports = getStaticImports(content);

      content = content.replace(/\.\.\/node_modules\/@catalyst-elements\//g, '../../');

      // Add a comment to the top of the file.
      content = '// Import the catalyts elements.\n' + content;

      // Export all the things.
      content = content + '\n// Export all the catalyst elements.\n';
      content = content + 'export {\n  ' + imports.join(',\n  ') + '\n};\n'

      return content;
    }))
    .pipe(rename({
      basename: bundleName,
      extname: '.js'
    }))
    .pipe(gulp.dest(distPath));
});

// Build the es5 script version of the components.
gulp.task('build-script', () => {
    return gulp.src(`${srcPath}/${bundleName}.js`)
    .pipe(webpackStream({
      target: 'web',
      mode: 'production',
      output: {
        chunkFilename: `${bundleName}.[id].es5.min.js`,
        filename: `${bundleName}.es5.min.js`
      },
      plugins: [
        new webpackClosureCompilerPlugin({
          compiler: {
            language_in: 'ECMASCRIPT6',
            language_out: 'ECMASCRIPT5',
            compilation_level: 'SIMPLE',
            assume_function_wrapper: true,
            output_wrapper: '(function(){%output%}).call(this)'
          }
        })
      ]
    }, webpack))
    .pipe(gulp.dest(distPath));
});

// Analyze the elements file.
gulp.task('create-analysis', gulp.series(() => {
  return gulp.src([`${catalystElementsPath}/*/dist/*.js`, '!**/*.min*'])
    .pipe(rename({
      dirname: '/'
    }))
    .pipe(gulp.dest(`${tmpPath}/elements`));
}, async () => {
  const catalystElements = await globby(`${tmpPath}/elements`);
  const analyses = [];

  for (let i = 0; i < catalystElements.length; i++) {
    const analyzer = Analyzer.createForDirectory('./');
    await analyzer.analyze([catalystElements[i]]).then((analysis) => {
      analyses.push(fixAnalysis(generateAnalysis(analysis, analyzer.urlResolver)));
    });
  }

  const fullAnalysis = deepmerge.all.call(this, analyses);
  const analysisFileContents = JSON.stringify(fullAnalysis);

  return file(`${analysisFilename}.json`, analysisFileContents, { src: true })
    .pipe(gulp.dest('./'));
}));

// Clone all the dependencies needed for docs.
gulp.task('docs-clone-dependencies', gulp.series(() => {
  return gulp.src('node_modules/**', { follow: true }).pipe(gulp.dest(`${tmpPath}/scripts`));
}, () => {
  return gulp.src([
    'index.html',
    'docs-imports-importer.js',
    'docs-imports.js',
    'analysis.json',
    'docs-build-config.json'
  ]).pipe(gulp.dest(`${tmpPath}`));
}));

// Update analysis.
gulp.task('docs-update-analysis', gulp.series(() => {
  return gulp.src(`${tmpPath}/analysis.json`, { base: './' })
    .pipe(modifyFile((content) => {
      let analysis = JSON.parse(content);
      if (analysis.elements) {
        for (let i = 0; i < analysis.elements.length; i++) {
          if (analysis.elements[i].demos) {
            for (let j = 0; j < analysis.elements[i].demos.length; j++) {
              analysis.elements[i].demos[j].url = path.normalize(`scripts/@catalyst-elements/dummy/${analysis.elements[i].demos[j].url}`);
            }
          }
        }
      }
      return JSON.stringify(analysis);
    }))
    .pipe(gulp.dest('./'));
}));

// Build the docs index.
gulp.task('docs-build-index', gulp.series((done) => {
  let content = '<script src="../../@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>';
  fs.writeFileSync(`${tmpPath}/custom-elements-es5-adapter-import.html`, content);
  done();
}, () => {
  return gulp.src(`${tmpPath}/index.html`, { base: './' })
    .pipe(inject(gulp.src(`${tmpPath}/custom-elements-es5-adapter-import.html`), {
      starttag: '<!-- [[inject:custom-elements-es5-adapter]] -->',
      endtag: '<!-- [[endinject]] -->',
      removeTags: true,
      transform: transformGetFileContents
    }))
    .pipe(gulp.dest('./'));
}, () => {
  return gulp.src(`${tmpPath}/index.html`, { base: './' })
    .pipe(modifyFile((content) => {
      content = content.replace(/\.\.\/\.\.\//g, './scripts/');
      return content.replace(/<script type="module"/g, '<script');
    }))
    .pipe(gulp.dest('./'));
}));

// Build the docs imports.
gulp.task('docs-build-imports', gulp.series(() => {
  return gulp.src(`${tmpPath}/docs-imports.js`, { base: './' })
    .pipe(modifyFile((content) => {
      return content.replace(/\.\.\/\.\.\//g, './scripts/');
    }))
    .pipe(gulp.dest('./'));
}, () => {
  return gulp.src(`${tmpPath}/docs-imports-importer.js`, { base: tmpPath })
    .pipe(named())
    .pipe(webpackStream({
      target: 'web',
      mode: 'production',
      output: {
        chunkFilename: 'docs-imports.[id].js',
        filename: 'docs-imports-importer.js'
      },
      plugins: [
        new webpackClosureCompilerPlugin({
          compiler: {
            language_in: 'ECMASCRIPT6',
            language_out: 'ECMASCRIPT5',
            compilation_level: 'SIMPLE',
            assume_function_wrapper: true,
            output_wrapper: '(function(){%output%}).call(this)'
          }
        })
      ]
    }, webpack))
    .pipe(foreach(function(stream, file) {
      return stream
        .pipe(modifyFile((content) => {
          return content.replace(/\\\\\$/g, '$');
        }))
        .pipe(rename({
          basename: path.basename(file.path, '.js'),
        }))
        .pipe(gulp.dest(tmpPath));
    }));
}));

// Build the demos.
gulp.task('docs-build-demos', gulp.series(() => {
  return gulp.src(`${tmpPath}/scripts/@catalyst-elements/*/demo/**/*.html`, { base: './' })
    .pipe(foreach(function(stream, file) {
      let relPath = path.relative(path.join(file.cwd, file.base), file.path);
      let dir = path.dirname(relPath);
      let es5AdapterFile = `${dir}/custom-elements-es5-adapter-import.html`;
      let es5AdapterSrc = path.relative(dir, `${tmpPath}/scripts/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js`);

      let content = `<script src="${es5AdapterSrc}"></script>`;
      fs.writeFileSync(es5AdapterFile, content);

      return stream
        .pipe(inject(gulp.src(es5AdapterFile, { base: './' }), {
          starttag: '<!-- [[inject:custom-elements-es5-adapter]] -->',
          endtag: '<!-- [[endinject]] -->',
          removeTags: true,
          transform: transformGetFileContents
        }))
        .pipe(through.obj(function(file, enc, cb) {
          del(es5AdapterFile);
          this.push(file);
          cb();
        }))
        .pipe(gulp.dest('./'));
    }));
}, () => {
  return gulp.src(`${tmpPath}/scripts/@catalyst-elements/*/demo/*.html`, { base: './' })
    .pipe(modifyFile((content) => {
      return content.replace(/<script type="module"/g, '<script');
    }))
    .pipe(gulp.dest('./'));
}));

// Build the imports for each demo.
gulp.task('docs-build-demo-imports', () => {
  return gulp.src(`${tmpPath}/scripts/@catalyst-elements/*/demo/imports-importer.js`)
    .pipe(foreach(function(stream, file) {
      let output = path.dirname(file.path);
      return stream
        .pipe(webpackStream({
          target: 'web',
          mode: 'production',
          output: {
            chunkFilename: 'imports.[id].js',
            filename: 'imports-importer.js'
          },
          plugins: [
            new webpackClosureCompilerPlugin({
              compiler: {
                language_in: 'ECMASCRIPT6',
                language_out: 'ECMASCRIPT5',
                compilation_level: 'SIMPLE',
                assume_function_wrapper: true,
                output_wrapper: '(function(){%output%}).call(this)'
              }
            })
          ]
        }, webpack))
        .pipe(foreach(function(stream, file) {
          return stream
            .pipe(modifyFile((content) => {
              return content.replace(/\\\\\$/g, '$');
            }))
            .pipe(rename({
              basename: path.basename(file.path, '.js'),
            }))
            .pipe(gulp.dest(output));
        }));
    }));
});

// Generate the docs.
gulp.task('docs-generate', gulp.series(async () => {
  let buildConfig = require(`${tmpPath}/docs-build-config.json`);

  let builtFiles = await globby(['docs-imports-importer.js', 'docs-imports.*.js'], { cwd: tmpPath });

  for (let i = 0; i < builtFiles.length; i++) {
    buildConfig.extraDependencies.push(builtFiles[i]);
  }
  fs.writeFileSync(`${tmpPath}/docs-build-config.json`, JSON.stringify(buildConfig));
}, () => {
  const docBuilder = new Builder(`${tmpPath}/docs-build-config.json`);
  return mergeStream(docBuilder.sources(), docBuilder.dependencies())
    .pipe(gulp.dest(docsPath));
}, () => {
  return gulp.src(`${docsPath}/${tmpPath}/**`)
    .pipe(gulp.dest(docsPath));
}, async () => {
  await del(`${docsPath}/${tmpPath}/`);
}));

// Build all the components' versions.
gulp.task('build', gulp.series('clean-dist', gulp.parallel('build-module', 'build-script'), 'clean-tmp'));

// Build the docs for all the components' versions.
gulp.task('build-docs', gulp.series(
  'clean-docs',
  'docs-clone-dependencies',
  'docs-update-analysis',
  'docs-build-index',
  'docs-build-imports',
  'docs-build-demos',
  'docs-build-demo-imports',
  'docs-generate',
  'clean-tmp'));

// Analyze all the components.
gulp.task('analyze', gulp.series('create-analysis', 'clean-tmp'));

// Default task.
gulp.task('default', gulp.series('build'));
