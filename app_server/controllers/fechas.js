var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://com02:iawcom02@ds143241.mlab.com:43241/laliga";

const fechas = function (req, res) {
      res.render('fechas', {title: 'La Liga', user : req.user});
};

const editarPartido = function(sReq, sRes){

	var fecha = sReq.body.fecha;
	var hora = sReq.body.hora;
	var estadio = sReq.body.estadio;
	var arbitro = sReq.body.arbitro;
	var id = sReq.body.id;
	var editor = sReq.body.editor;
 
	var ObjectId = require('mongodb').ObjectID;

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("laliga");	

		dbo.collection("fechas").update({"partido._id": new ObjectId(id)}, {$set : {"partido.$.fecha": fecha, "partido.$.hora": hora, "partido.$.estadio": estadio, "partido.$.arbitro": arbitro, "partido.$.editor": editor}}, function(err, res) {			
			if (err) throw err;
			sRes.send("Exito");
   		});		

	});
	
}

module.exports = {
      fechas, editarPartido
}; 
