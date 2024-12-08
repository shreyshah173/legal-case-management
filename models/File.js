// uploadFiles.js
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadFiles = async (filePaths) => {
  const uploadPromises = filePaths.map(async (filePath) => {
    try {
      const result = await cloudinary.uploader.upload(filePath);
      fs.unlinkSync(filePath); // Remove file after upload
      return result;
    } catch (error) {
      throw new Error(`Upload failed for ${filePath}: ${error.message}`);
    }
  });
  
  return Promise.all(uploadPromises);
};

module.exports = uploadFiles;
