// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const esprima = require('esprima');
const modifyFile = require('gulp-modify-file');
const rename = require('gulp-rename');
const stripComments = require('gulp-strip-comments');
const webpack = require('webpack');
const webpackClosureCompilerPlugin = require('webpack-closure-compiler');
const webpackStream = require('webpack-stream');

// Get all the static imports in a JS file.
function getStaticImports(js) {
  let parsed = esprima.parseModule(js);
  let imports = [];

  // Get all the imports
  for (let i = 0; i < parsed.body.length; i++) {
    if (parsed.body[i].type === 'ImportDeclaration') {
      for (let j = 0; j < parsed.body[i].specifiers.length; j++) {
        if (
          parsed.body[i].specifiers[j].type === 'ImportDefaultSpecifier' ||
          parsed.body[i].specifiers[j].type === 'ImportSpecifier'
        ) {
          if (parsed.body[i].specifiers[j].local.type === 'Identifier') {
            imports.push(parsed.body[i].specifiers[j].local.name);
          }
        }
      }
    }
  }

  return imports;
}

// Build the es6 module version of the components.
gulp.task('build-module', () => {
  return gulp
    .src(`./${config.src.path}/${config.bundle.name}.js`)
    .pipe(stripComments())
    .pipe(
      modifyFile(content => {
        let imports = getStaticImports(content);

        content = content.replace(
          /\.\.\/node_modules\/@catalyst-elements\//g,
          '../../'
        );

        // Add a comment to the top of the file.
        content = '// Import the catalyts elements.\n' + content;

        // Export all the things.
        content = content + '\n// Export all the catalyst elements.\n';
        content = content + 'export {\n  ' + imports.join(',\n  ') + '\n};\n';

        return content;
      })
    )
    .pipe(
      rename({
        basename: config.bundle.name,
        extname: '.js'
      })
    )
    .pipe(gulp.dest(`./${config.dist.path}`));
});

// Build the es5 script version of the components.
gulp.task('build-script', () => {
  return gulp
    .src(`./${config.src.path}/${config.bundle.name}.js`)
    .pipe(
      webpackStream(
        {
          target: 'web',
          mode: 'production',
          output: {
            chunkFilename: `${config.bundle.name}.[id].es5.min.js`,
            filename: `${config.bundle.name}.es5.min.js`
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
        },
        webpack
      )
    )
    .pipe(gulp.dest(`./${config.dist.path}`));
});

// Build all the components' versions.
gulp.task(
  'build',
  gulp.series(
    'clean-dist',
    gulp.parallel('build-module', 'build-script'),
    'clean-tmp'
  )
);
