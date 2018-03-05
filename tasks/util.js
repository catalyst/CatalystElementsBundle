const through = require('through2');

/**
 * Transform function that returns the contents of the given file.
 *
 * @param {string} filePath
 * @param {File} file
 */
function transformGetFileContents(filePath, file) {
  return file.contents.toString('utf8')
}

/**
 * Create an empty stream.
 *
 * @returns {Stream}
 */
function createEmptyStream() {
  var pass = through.obj();
  process.nextTick(pass.end.bind(pass));
  return pass;
}

module.exports = {
  // Transform functions.
  transforms: {
    getFileContents: transformGetFileContents
  },

  get emptyStream() {
    return createEmptyStream();
  }
};
