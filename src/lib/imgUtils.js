const fs = require('fs');
const path = require('path');

const _dir = '/res/img';

function imageBase64ToImageFile(imagePath, image) {
  const asciiToBinary = Buffer.from(image.imgTo64, 'base64');

  fs.writeFile(imagePath, asciiToBinary, (err) => {
    if (err) {
      return new Error(
        `There was a problem saving when trying to write ${image.imgName}`
      );
    }
  });
}

function handleImageData(image, prefix) {
  imageBase64ToImageFile(
    path.join(`public${_dir}/${prefix}_${image.imgName}`),
    image
  );
}

module.exports = {
  handleImageData,
};
