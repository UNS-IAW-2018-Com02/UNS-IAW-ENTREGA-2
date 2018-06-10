const Fechas = require('../models/fechas');

const fechas = function (req, res) {
	  res.render('fechas', {title: 'La Liga', user : req.user});
};

module.exports = {
	  fechas
}; 
