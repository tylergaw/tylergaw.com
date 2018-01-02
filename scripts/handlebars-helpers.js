const moment = require('moment');

// Public API
let helpers = {};

/**
 * fingerprintedImagePath creates a fingerprinted path to an image.
 * ex:
 *  {{fingerprintedImagePath 'social-sharing.png' context}}
 *  'social-sharing-20e75b9dc4645df00f05aed9aa42442f.png'
 *
 * @param {String} src The path of the image within /images
 * @param {Object} options The metalsmith context
 * @return {String|null} path | null
 */
helpers.fingerprintedImagePath = (src, options) => {
  const metadata = options.data.root;
  const path = metadata.fingerprint[`images/${src}`];
  return path || null;
};

/**
 * Format dates
 *
 * Usage:
 *  {{dateFormat date 'MMMM D[, ] YYYY'}}
 *
 * @param {String} date
 * @param {String} format. default 'MMM D, YYYY H[:]mm z'
 * @return {String}
 */
helpers.dateFormat = (date, format) => {
  let fmt = 'MMM D, YYYY LT';

  if (format && typeof format === 'string') {
    fmt = format;
  }

  return moment(date).format(fmt);
};

module.exports = helpers;
