const mongoose = require('mongoose');
const Noticia = require('../models/noticias');
var express = require('express');
const path = require('path');
var multer = require('multer');

const storage = multer.diskStorage({
  destination: 'public/images',
  filename: function(req, file, cb){
    cb(null,file.originalname);
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('imgNoticia');


// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

const noticiasEditor = function (req, res) {
      res.render('noticiasEditor', {title: 'La Liga', user : req.user});
}


const noticias = function (req, res) {
      res.render('noticias', {title: 'La Liga',  user : req.user});
      console.log(req.params.id)
}

const guardarNoticia = function(req, res){

	upload(req, res, (err) => {

	let n = new Noticia();

	var fecha = new Date();
    var dd = ("0" + fecha.getDate()).slice(-2);
    var mm = ("0" + (fecha.getMonth()+1)).slice(-2)
    var yyyy = fecha.getFullYear();

    fecha = dd + '/' + mm + '/' + yyyy;    

	n.titulo = req.body.titulo;
	n.sintesis = req.body.sintesis;
	n.cuerpo = req.body.cuerpo;
	n.video = req.body.video;
	n.categoria = req.body.categoria;
	n.fecha = fecha;
	n.imagen = "../images/"+req.file.originalname;
	n.seleccionada = "false";

	n.save(function (err) {
	  if (err) throw err;
	});

    if(err){
      res.render('index', {
        msg: err
      });
    } else
      {
        res.render('noticiasEditor', {respuesta: true});
      }
  });

}

module.exports = {

	noticias, 
	noticiasEditor, 
	guardarNoticia
}