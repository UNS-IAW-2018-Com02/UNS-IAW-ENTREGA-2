var Equipo = require('../models/equipos');

const equipos = function (req, res) {
	  res.render('equipos', {title: 'La Liga', user : req.user});
};

module.exports = {
	equipos
}; 
