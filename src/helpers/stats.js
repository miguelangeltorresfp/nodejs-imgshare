const { Comment, Image } = require('../models');

async function imagesCounter() {
  return Image.countDocuments();
}

async function commentsCounter() {
  return Comment.countDocuments();
}

async function imagesTotalViewsCounter() {
  const result = await Image.aggregate([
    {
      $group: {
        _id: '1',
        viewsTotal: { $sum: '$views' },
      },
    },
  ]);
  return result[0].viewsTotal;
}

async function likesTotalCounter() {
  const result = await Image.aggregate([
    {
      $group: {
        _id: '1',
        likesTotal: { $sum: '$likes' },
      },
    },
  ]);
  return result[0].likesTotal;
}

module.exports = async () => {
  const results = await Promise.all([
    imagesCounter(),
    commentsCounter(),
    imagesTotalViewsCounter(),
    likesTotalCounter(),
  ]);

  return {
    images: results[0],
    comments: results[1],
    views: results[2],
    likes: results[3],
  };
};
