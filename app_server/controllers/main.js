const mongoose = require('mongoose');
const Equipo = require('../models/equipos');
const Fecha = require('../models/fechas');
const Users = require('../models/users');
const Noticia = require('../models/noticias');
const ObjectId = require('mongodb').ObjectID;

const index = function (req, res) {
	  res.render('index', {title: 'La Liga', user : req.user});
};

const videos = function (req, res) {
	res.render('videos', {title: 'La Liga', user: req.user});	
};


const posiciones = function (req, res) {
	  res.render('posiciones', {title: 'La Liga', user : req.user});
};

const estadisticas = function (req, res) {
	  res.render('estadisticas', {title: 'La Liga', user : req.user});
};

const guardarFavorito = function(sReq, sRes){
	
	Users.findOne({"_id": sReq.user._id, "equipo_favorito": sReq.body.equipo},
		function(err, res) {			
			if (err) throw err;
			if (res){
				Users.update({"_id": sReq.user._id}, {$set: {"equipo_favorito": ""}},
					function(Berr, Bres) {			
						if (Berr) throw Berr;
						sRes.send("Exists");
					});		
			}
			else{
				Users.update({"_id": sReq.user._id}, {$set: {"equipo_favorito": sReq.body.equipo}},
					function(Ierr, Ires) {			
						if (Ierr) throw Ierr;
						sRes.send("Exito");
					});		
			}
		});			   	
};

const cambiarEstilo = function(sReq, sRes){
	
	Users.updateOne({"_id": sReq.user._id}, {$set: {"estilo": sReq.body.estilo }}, function(err, res){
		if (err) throw err;
		sRes.send(sReq.body);
	});	
}

const guardarResultado = function(sReq, sRes){

	console.log(sReq.body);

	var goles = JSON.parse(sReq.body.goles);
	var asistencias = JSON.parse(sReq.body.asistencias);
	var amarillas = JSON.parse(sReq.body.amarillas);
	var rojas = JSON.parse(sReq.body.rojas);
	
	var jornada = parseInt(sReq.body.jornada);

	//var fecha = parseInt(sReq.body.fecha);
	var fecha = sReq.body.fecha;
	
		//Agrega un gol a cada jugador 
		for (var i = 0; i < goles.length; i++){
			Equipo.update({"jugadores.nombre_jugador": goles[i]}, {$inc: {"jugadores.$.goles": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
		}	

		//Agrega una asistencia a cada jugador
		for (var i = 0; i < asistencias.length; i++){
			Equipo.update({"jugadores.nombre_jugador": asistencias[i]}, {$inc: {"jugadores.$.asistencias": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
		}

		//Agrega una amarilla a cada jugador
		for (var i = 0; i < amarillas.length; i++){
			Equipo.update({"jugadores.nombre_jugador": amarillas[i]}, {$inc: {"jugadores.$.amarillas": 1}}, function(erra, resa){
				if (erra) throw erra;
			});	
		}
		//Agrega una roja a cada jugador
		for (var i = 0; i < rojas.length; i++){
			Equipo.update({"jugadores.nombre_jugador": rojas[i]}, {$inc: {"jugadores.$.rojas": 1}}, function(erra, resa){
				if (erra) throw erra;
			});		
		}
		//Agrega los goles a favor y en contra del equipo local
		Equipo.update({"nombre_equipo": sReq.body.local}, {$inc: {"goles_a_favor": parseInt(sReq.body.goles_local), "goles_en_contra": parseInt(sReq.body.goles_visita)}}, function(erra, resa){
			if (erra) throw erra;
		});	
		//Agrega los goles a favor y en contra del equipo visitante
		Equipo.update({"nombre_equipo": sReq.body.visitante}, {$inc: {"goles_a_favor": parseInt(sReq.body.goles_visita),"goles_en_contra": parseInt(sReq.body.goles_local)}}, function(erra, resa){
			if (erra) throw erra;
		});	
		
		//Agrega a cada equipo un partido perdido, ganado o empatado, segun corresponda.
		if (sReq.body.goles_local > sReq.body.goles_visita){
			Equipo.update({"nombre_equipo": sReq.body.local}, {$inc: {"partidos_ganados": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
			Equipo.update({"nombre_equipo": sReq.body.visitante}, {$inc: {"partidos_perdidos": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
		}
		else if (sReq.body.goles_local < sReq.body.goles_visita){
			Equipo.update({"nombre_equipo": sReq.body.local}, {$inc: {"partidos_perdidos": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
			Equipo.update({"nombre_equipo": sReq.body.visitante}, {$inc: {"partidos_ganados": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
		}
		else{
			Equipo.update({"nombre_equipo": sReq.body.local}, {$inc: {"partidos_empatados": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
			Equipo.update({"nombre_equipo": sReq.body.visitante}, {$inc: {"partidos_empatados": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
		}

		Fecha.update({"numero": jornada, "partidos.id_partido": fecha}, {$set: {"partidos.$.resultado": sReq.body.resultado, "partidos.$.editor": "No Asignado"}}, function(err, res){
			if (err) throw err;
			sRes.send(sReq.body);
		});

	}

	module.exports = {
		index,
		videos,
		posiciones,
		estadisticas,
		guardarFavorito,
		cambiarEstilo,
		guardarResultado
	}; 
