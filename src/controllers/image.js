const path = require('path');
const fs = require('fs-extra');
const { randomNumber } = require('../helpers/libs');
const md5 = require('md5');
// Por defecto nodejs busca un archivo index, así que no hay que especificarlo '../models/index'
const { Image, Comment } = require('../models');
const sidebar = require('../helpers/sidebar');

const ctrl = {};

ctrl.index = async (req, res) => {
  let viewModel = { image: {}, comments: {} };
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    image.views += 1;
    viewModel.image = image;
    await image.save();
    const comments = await Comment.find({ image_id: image._id });
    viewModel.comments = comments;
    viewModel = await sidebar(viewModel);
    res.render('image', viewModel);
  } else {
    res.redirect('/');
  }
};

ctrl.create = (req, res) => {
  const saveImage = async () => {
    const imgName = randomNumber();
    const images = await Image.find({ filename: imgName });
    if (images.length > 0) {
      saveImage();
    } else {
      console.log(imgName);
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`src/public/upload/${imgName}${ext}`);

      if (
        ext === '.png' ||
        ext === '.jpg' ||
        ext === '.jpeg' ||
        ext === '.gif'
      ) {
        await fs.rename(imageTempPath, targetPath);
        const newImage = new Image({
          title: req.body.title,
          filename: imgName + ext,
          description: req.body.description,
        });
        const imageSaved = await newImage.save();
        res.redirect(`/images/${imgName}`);
      } else {
        await fs.unlink(imageTempPath);
        res.status(500).json({ error: 'Only Images are allowed' });
      }
    }
  };
  saveImage();
};

ctrl.like = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    image.likes += 1;
    await image.save();
    res.json({ likes: image.likes });
  } else {
    res.status(500).json({ error: 'Internal Error' });
  }
};

ctrl.comment = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();
    res.redirect(`/images/${image.uniqueId}`);
  } else {
    res.redirect('/');
  }
};

ctrl.remove = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    await fs.unlink(path.resolve(`./src/public/upload/${image.filename}`));
    await Comment.deleteMany({ image_id: image._id });
    await image.remove();
    res.json(true);
  }
};

module.exports = ctrl;
