const { Comment, Image } = require('../models');

module.exports = {
  async newest() {
    const comments = await Comment.find()
      .limit(5)
      .sort({ timestamp: -1 });

    comments.forEach(async (comment, index) => {
      const image = await Image.findOne({ _id: comment.image_id });
      comment.image = image;
    });
    /*
    for (const comment of comments) {
      const image = Image.findOne({ _id: comment.image_id });
      comment.image = image;
    }
    */
    return comments;
  },
};
