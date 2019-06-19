const sharp = require('sharp');

sharp.cache(false);

module.exports = (buffer, width, height) => {
  return sharp(buffer)
    .resize(width, height)
    .toBuffer();
};