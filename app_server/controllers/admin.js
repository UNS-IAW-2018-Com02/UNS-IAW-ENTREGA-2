const mongoose = require('mongoose');
const Fecha = require('../models/fechas');
const Users = require('../models/users');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://com02:iawcom02@ds143241.mlab.com:43241/laliga";

const indexAdmin = function (req, res) {
      res.render('indexAdmin', {title: 'La Liga'});
};

const equipos = function (req, res) {
      res.render('equiposAdmin');
};

const fechas = function (req, res) {
      res.render('fechasAdmin');
};

const noticias = function (req, res) {
      res.render('noticiasAdmin');
};

const opciones = function(req, res){
	  res.render('opcionesAdmin');
}

const guardarOpciones = function(sReq, sRes){    

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("laliga");
		
		dbo.collection("configuracions").updateOne({},
			{$set : {"equipos": sReq.body.equipos, "cant_jugadores" : sReq.body.cant_jugadores, "fecha": sReq.body.fecha}},
			 function(err, res) {			
			if (err) throw err;
			console.log("1 document inserted");
   		});

		var seleccionados = JSON.parse(sReq.body.seleccionados);
		for (var i = 0; i < seleccionados.length; i++){
	   		dbo.collection("users").updateOne({"google.email": seleccionados[i]},
				{$set : {"editor": true}},
				function(err, res) {			
				if (err) throw err;
				console.log("1 document inserted");
	   		});
	   	}
	   	
	});

}

const eliminarNoticia = function(sReq, sRes){    

	var titulo = sReq.body.titulo;
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("laliga");
		
		dbo.collection("noticias").remove({"titulo" : titulo},
			 function(err, res) {
		
			
			if (err) throw err;
			console.log("1 document removed");

			sRes.send("Exito");
   		});

	});

}


const alta_baja_noticia = function(sReq, sRes){   

	var titulo = sReq.body.titulo;
	var nuevoEstado = sReq.body.estado;

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("laliga");

			dbo.collection("noticias").update(
				{"titulo" : titulo},
				{$set: {"seleccionada" : nuevoEstado}}, 

				function(err, res) {
		
			
				if (err) throw err;

				sRes.send("Exito");
   			});	

	});	
}

const armarFixture = function(sReq, sRes){
	
	let f = new Fecha();

	var numero = sReq.body.numero;
	var partidos = JSON.parse(sReq.body.partidos);

	f.numero = parseInt(numero);
	f.partido = partidos;

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("laliga");	

		dbo.collection("fechas").insertOne(f, {setDefaultsOnInsert: true},
			function(err, res) {			
				if (err) throw err;
				console.log("1 document inserted");	
	   		});

   			sRes.send("Exito");
	});	
}

const guardarFavorito = function(sReq, sRes){
	
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("laliga");

		dbo.collection("users").findOne({"_id": sReq.user._id, "equipo_favorito": sReq.body.equipo},
			function(err, res) {			
			if (err) throw err;
			console.log(res);
			if (res){
				dbo.collection("users").update({"_id": sReq.user._id}, {$set: {"equipo_favorito": ""}},
					function(Berr, Bres) {			
					if (Berr) throw Berr;
					sRes.send("Exists");
	   			});		
			}
			else{
				dbo.collection("users").update({"_id": sReq.user._id}, {$set: {"equipo_favorito": sReq.body.equipo}},
					function(Ierr, Ires) {			
					if (Ierr) throw Ierr;
					sRes.send("Exito");
	   			});		
			}
   		});			   	
	});
};


const cambiarEstilo = function(sReq, sRes){
	
	MongoClient.connect(url, function(err, db) {

		var dbo = db.db("laliga");

		dbo.collection("users").updateOne({"_id": sReq.user._id}, {$set: {"estilo": sReq.body.estilo }}, function(err, res){
			if (err) throw err;
			sRes.send(sReq.body);
		});	

	});
}

const guardarResultado = function(sReq, sRes){

	var goles = JSON.parse(sReq.body.goles);
	var asistencias = JSON.parse(sReq.body.asistencias);
	var amarillas = JSON.parse(sReq.body.amarillas);
	var rojas = JSON.parse(sReq.body.rojas);
	
	var jornada = parseInt(sReq.body.jornada);
	var fecha = parseInt(sReq.body.fecha);
		
	MongoClient.connect(url, function(err, db) {
		var dbo = db.db("laliga");
		dbo.collection("fechas").update({"numero": jornada, "partido.id_partido": fecha}, {$set: {"partido.$.resultado": sReq.body.resultado}}, function(err, res){
			if (err) throw err;
			sRes.send(sReq.body);
		});	

		//Agrega un gol a cada jugador 
		for (var i = 0; i < goles.length; i++){
			dbo.collection("equipos").update({"jugadores.nombre_jugador": goles[i]}, {$inc: {"jugadores.$.goles": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
		}	

		//Agrega una asistencia a cada jugador
		for (var i = 0; i < asistencias.length; i++){
			dbo.collection("equipos").update({"jugadores.nombre_jugador": asistencias[i]}, {$inc: {"jugadores.$.asistencias": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
		}

		//Agrega una amarilla a cada jugador
		for (var i = 0; i < amarillas.length; i++){
			dbo.collection("equipos").update({"jugadores.nombre_jugador": amarillas[i]}, {$inc: {"jugadores.$.amarillas": 1}}, function(erra, resa){
				if (erra) throw erra;
			});	
		}
		//Agrega una roja a cada jugador
		for (var i = 0; i < rojas.length; i++){
			dbo.collection("equipos").update({"jugadores.nombre_jugador": rojas[i]}, {$inc: {"jugadores.$.rojas": 1}}, function(erra, resa){
				if (erra) throw erra;
			});		
		}
		//Agrega los goles a favor y en contra del equipo local
		dbo.collection("equipos").update({"nombre_equipo": sReq.body.local}, {$inc: {"goles_a_favor": parseInt(sReq.body.goles_local), "goles_en_contra": parseInt(sReq.body.goles_visita)}}, function(erra, resa){
				if (erra) throw erra;
		});	
		//Agrega los goles a favor y en contra del equipo visitante
		dbo.collection("equipos").update({"nombre_equipo": sReq.body.visitante}, {$inc: {"goles_a_favor": parseInt(sReq.body.goles_visita),"goles_en_contra": parseInt(sReq.body.goles_local)}}, function(erra, resa){
				if (erra) throw erra;
		});	
		
		//Agrega a cada equipo un partido perdido, ganado o empatado, segun corresponda.
		if (sReq.body.goles_local > sReq.body.goles_visita){
			dbo.collection("equipos").update({"nombre_equipo": sReq.body.local}, {$inc: {"partidos_ganados": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
			dbo.collection("equipos").update({"nombre_equipo": sReq.body.visitante}, {$inc: {"partidos_perdidos": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
		}
		else if (sReq.body.goles_local < sReq.body.goles_visita){
			dbo.collection("equipos").update({"nombre_equipo": sReq.body.local}, {$inc: {"partidos_perdidos": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
			dbo.collection("equipos").update({"nombre_equipo": sReq.body.visitante}, {$inc: {"partidos_ganados": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
		}
		else{
			dbo.collection("equipos").update({"nombre_equipo": sReq.body.local}, {$inc: {"partidos_empatados": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
			dbo.collection("equipos").update({"nombre_equipo": sReq.body.visitante}, {$inc: {"partidos_empatados": 1, "partidos_jugados": 1}}, function(erra, resa){
				if (erra) throw erra;
			});
		}

	});
	
}

module.exports = {
	indexAdmin,
    equipos,
    fechas,
    noticias,
    opciones,
    guardarOpciones,
    eliminarNoticia,
    alta_baja_noticia,
    armarFixture,
    guardarFavorito,
    cambiarEstilo,
    guardarResultado 	 
}; 
