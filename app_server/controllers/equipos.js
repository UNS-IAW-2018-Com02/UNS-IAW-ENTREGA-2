var Equipo = require('../models/equipos');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://com02:iawcom02@ds143241.mlab.com:43241/laliga";


const equipos = function (req, res) {
      res.render('equipos', {title: 'La Liga', user : req.user});
};


const nuevoJugador = function(sReq, sRes){    

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;		
		var dbo = db.db("laliga"); 

		dbo.collection("equipos").findOne(
			{"nombre_equipo": sReq.body.nombre_equipo, "jugadores": {$elemMatch: {"dorsal": parseInt(sReq.body.dorsal)}}},
			function(err, res){
				if (err) throw err;
				if (!res){	
					dbo.collection("equipos").updateOne(
						{"nombre_equipo": sReq.body.nombre_equipo }, 
						{$push: {"jugadores" : {"dorsal": parseInt(sReq.body.dorsal), "nombre_jugador": sReq.body.nombre_jugador, "edad": sReq.body.edad, "nacionalidad": sReq.body.nacionalidad, "posicion": sReq.body.posicion}}}, 
						function(errI, resI) {
							if (errI) throw errI;
							sRes.send("Exito");
						});						
				}
				else{
					sRes.send("Fallo");
				}
				
			});
		
	});
	
};

const nuevoEquipo = function(sReq, sRes){    

    let e = new Equipo();

	e.nombre_equipo = sReq.body.nombre_equipo; 
	e.nombre_equipo_movil = sReq.body.nombre_equipo.movil;
	e.escudo = sReq.body.escudo_equipo;

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("laliga");	

		dbo.collection("equipos").findOne({"nombre_equipo": sReq.body.nombre_equipo}, function(err, res) {			
			if (err) throw err;
			if (!res){
				dbo.collection("equipos").insertOne(e, function(errI, resI) {			
					if (errI) throw errI;
					sRes.send("Exito");
   				});
			}
			else{
				sRes.send("Fallo");
			}
   		});		

	});
};

const eliminarJugador = function(sReq, sRes){

	var equipo = sReq.body.equipo;

	var dorsal = sReq.body.dorsal;

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("laliga");	

		dbo.collection("equipos").updateOne({"nombre_equipo": equipo}, {$pull : {"jugadores" : {"dorsal": parseInt(dorsal)}}}, function(err, res) {			
			if (err) throw err;
			sRes.send("Exito");
   		});		

	});

}

const eliminarEquipo = function(sReq, sRes){

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("laliga");	

		dbo.collection("equipos").remove({"nombre_equipo": sReq.body.nombre}, function(err, res) {			
			if (err) throw err;
			sRes.send("Exito");
   		});		

	});
}

module.exports = {
    equipos, 
    nuevoJugador, 
    nuevoEquipo, 
    eliminarJugador,
    eliminarEquipo
}; 
