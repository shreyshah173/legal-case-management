
const File = require("../models/File");
const cloudinary = require("cloudinary").v2;
exports.localFileUpload = (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const file = req.files.file;
    let path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    file.mv(path, (err) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, message: "Error moving file" });
      }
      res.json({
        success: true,
        message: "Local file uploaded successfully",
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
};
function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  options.resource_type = "auto";
  if (quality) {
    options.quality = quality;
  }
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}
exports.imageUpload = async (req, res) => {
  try {
    const { name, tags, email } = req.body;

    const file = req.files.imageFile;

    const supportedTypes = ["jpg", "png", "jpeg"];
    const fileType = file.name.split(".")[1].toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid file type supported" });
    }

    //file format supported
    const response = await uploadFileToCloudinary(file, "firsttime");
    //save to database
    const fileData = await File.create({
      name,
      tags,
      email,
      imageURL: response.secure_url,
    });

    res.json({
      success: true,
      imgURL: response.secure_url,
      message: "Image uploaded successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "Error uploading image" });
  }
};

exports.videoUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    const file = req.files.videoFile;

    //validation
    const supportedTypes = ["mp4", "mov"];
    const fileType = file.name.split(".")[1].toLowerCase();
    //add a upper limit of 5MB
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid video type supported" });
    }
    const response = await uploadFileToCloudinary(file, "firsttime");

    const fileData = await File.create({
      name,
      email,
      tags,
      imgURL: response.secure_url,
    });
    res.json({
      success: true,
      imgURL: response.secure_url,
      message: "Video uploaded successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error uploading video" });
  }
};

exports.imageSizeReducer = async (req, res) => {
  try {
    //data fetch
    const { name, tags, email } = req.body;

    const file = req.files.imageFile;

    //validation

    const supportedTypes = ["jpg", "png", "jpeg"];
    const fileType = file.name.split(".")[1].toLowerCase();
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid file type supported" });
    }

    //file format supported
    //homework - make it reduce by height
    const response = await uploadFileToCloudinary(file, "firsttime", 10);
    //save to database
    const fileData = await File.create({
      name,
      tags,
      email,
      imageURL: response.secure_url,
    });

    res.json({
      success: true,
      imgURL: response.secure_url,
      message: "Image uploaded successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "Error uploading image" });
  }
};
