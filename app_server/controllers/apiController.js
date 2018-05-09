const mongoose = require('mongoose');
const Equipo = mongoose.model('Equipo');
const Fecha = mongoose.model('Fecha');
const Noticia = mongoose.model('Noticia');
const Configuracion = mongoose.model('Configuracion');
const Usuario = mongoose.model('User');
const ObjectId = require('mongodb').ObjectID;


const getEquipos = function (req, res) {
	Equipo
	.find()
	.exec((err, equipos) => {
		if (err) { 
			res
			.status(404)
			.json(err);    
		        	} else {
			res
			.status(200)
			.json(equipos);
		}
	})
};

const getConfiguracion = function (req, res) {
	Configuracion
	.find()
	.exec((err, datos) => {
		if (err) { 
			res
			.status(404)
			.json(err);    
		        	} else {
			res
			.status(200)
			.json(datos);
		}
	})
	
};

const getFechas = function (req, res) {
	Fecha
	.find()
	.exec((err, fechas) => {
		if (err) { 
			res
			.status(404)
			.json(err);    
		        	} else {
			res
			.status(200)
			.json(fechas);
		}
	})
};

const getPartidosEditor = function (req, res) {

	var id_editor = req.body.id;
	Fecha
	.aggregate([{ $addFields: { partido: { $filter: { input: "$partido", as: "game", cond: { $eq: [ "$$game.editor", new ObjectId(id_editor) ] } } } } }, 
	{ $match: { $expr: { $gt: [ { $size: "$partido" }, 0 ] } } } ])
	.exec((err, fechas) => {
		if (err) { 
			res
			.status(404)
			.json(err);    
		        	} else {
			res
			.status(200)
			.json(fechas);
		}
	})
};

const getNoticias = function (req, res) {
	Noticia
	.find()
	.exec((err, noticias) => {
		if (err) { 
			res
			.status(404)
			.json(err);    
		        	} else {
			res
			.status(200)
			.json(noticias);
		}
	})
};


const getUsuarios = function (req, res) {
	Usuario
	.find()
	.exec((err, noticias) => {
		if (err) { 
			res
			.status(404)
			.json(err);    
		        	} else {
			res
			.status(200)
			.json(noticias);
		}
	})
};

const getCurrentUser = function(req, res){
	if (req.user === undefined){
		res.json({});
	} else{
		res.json({
			user: req.user
		})
	}
}


module.exports = {
	getEquipos,
	getFechas,
	getNoticias,
	getConfiguracion,
	getPartidosEditor,
	getUsuarios,
	getCurrentUser
};