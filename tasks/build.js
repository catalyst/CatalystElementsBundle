// Load config.
const config = require('./config.js');

// Libraries.
const gulp = require('gulp');
const esprima = require('esprima');
const modifyFile = require('gulp-modify-file');
const prettier = require('prettier');
const rename = require('gulp-rename');
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
    .pipe(
      modifyFile(content => {
        let imports = getStaticImports(content);

        // Strip eslint lines.
        content = content.replace(/\/\*\s*eslint[ -].*\*\//gm, '');
        content = content.trim();
        content = content.replace(
          /\.\.\/node_modules\/@catalyst-elements\//g,
          '../'
        );

        // Export all the things.
        content = content + '\n\n// Export everything.\n';
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
gulp.task(
  'build-script',
  gulp.series(
    () => {
      return gulp
        .src(`./${config.src.path}/${config.bundle.name}.js`)
        .pipe(
          modifyFile(content => {
            content = content.replace(
              /\.\.\/node_modules\//g,
              '../../node_modules/'
            );

            let imports = getStaticImports(content);

            content = content + '\n// Export everything.\n';

            // Export all the things.
            for (let i = 0; i < imports.length; i++) {
              content =
                content +
                `window.CatalystElements.${imports[i]} = ${imports[i]};\n`;
            }

            return content;
          })
        )
        .pipe(
          rename({
            basename: config.bundle.name,
            extname: '.js'
          })
        )
        .pipe(gulp.dest(`./${config.temp.path}/build`));
    },
    () => {
      return gulp
        .src(`./${config.temp.path}/build/${config.bundle.name}.js`)
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
    }
  )
);

gulp.task(
  'build-finalize',
  gulp.parallel(
    () => {
      return gulp
        .src(['README.md', 'LICENSE'])
        .pipe(gulp.dest(`./${config.dist.path}`));
    },
    () => {
      return gulp
        .src('package.json')
        .pipe(
          modifyFile(content => {
            const json = JSON.parse(content);
            json.main = `${config.bundle.name}.js`;
            json.scripts = {
              prepublishOnly:
                "node -e \"assert.equal(require('./package.json').version, require('../package.json').version)\""
            };
            delete json.directories;
            delete json.engines;
            delete json.devDependencies;
            return prettier.format(JSON.stringify(json), { parser: 'json' });
          })
        )
        .pipe(gulp.dest(`./${config.dist.path}`));
    }
  )
);

// Build all the components' versions.
gulp.task(
  'build',
  gulp.series(
    'clean-dist',
    gulp.parallel('build-module', 'build-script'),
    'build-finalize'
  )
);
