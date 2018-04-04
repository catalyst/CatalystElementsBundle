/* eslint-env node */

const gulp = require('gulp');
const buildProcess = require('@catalyst-elements/build-process');

buildProcess.setConfig('./package.json', {
  componenet: {
    name: 'catalyst-elements'
  },

  build: {
    bundleImports: true,
    exportAllStaticImports: true
  },

  src: {
    entrypoint: 'bundle.mjs'
  }
});

for (const [taskName, taskFunction] of Object.entries(buildProcess.tasks)) {
  gulp.task(taskName, taskFunction(gulp));
}
