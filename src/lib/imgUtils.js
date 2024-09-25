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

function findOldImageFile(filePath, keyWord, callback) {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      callback(err, null);
      return;
    }

    const foundFiles = files.filter((file) => file.includes(keyWord));

    if (foundFiles.length > 0) {
      const fileFound = foundFiles.map((file) => path.join(filePath, file));
      callback(null, fileFound);
    } else {
      callback(null, null);
    }
  });
}

function replaceImageFile(image, prefix) {
  findOldImageFile(path.join('public', _dir), prefix, (err, oldImgFile) => {
    if (err) {
      return new Error(err);
    }
    if (oldImgFile) {
      oldImgFile.forEach((filePath) => deleteImageFile(filePath));
    }

    handleImageData(image, prefix);
  });
}

function deleteImageFile(imgPath) {
  if (!imgPath.includes('public')) {
    imgPath = path.join('public', imgPath);
  }

  fs.unlink(imgPath, (err) => {
    if (err) {
      return new Error('Error deleting file: ', err);
    }
  });
}

module.exports = {
  handleImageData,
  replaceImageFile,
  deleteImageFile,
};
