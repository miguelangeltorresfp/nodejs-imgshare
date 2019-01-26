const ctrl = {};

const { Image } = require('../models');
const sidebar = require('../helpers/sidebar');

// Contolador
ctrl.index = async (req, res) => {
  // Para ordenar de manera ascendente se coloca 1, de manera descedente -1
  const images = await Image.find().sort({ timestamp: -1 });
  let viewModel = { images: [] };
  viewModel.images = images;
  viewModel = await sidebar(viewModel);
  // console.log(viewModel.sidebar.comments[0].image);
  res.render('index', viewModel);
};

module.exports = ctrl;
