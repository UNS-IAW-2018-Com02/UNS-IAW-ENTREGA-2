var express = require('express');
var router = express.Router();

const ctrlMain = require('../controllers/main');
const ctrlEquipos = require('../controllers/equipos');
const ctrlFechas = require('../controllers/fechas');
const ctrlNoticias = require('../controllers/noticias');

router.get('/', ctrlMain.index);

router.get('/equipos', ctrlEquipos.equipos);

router.get('/fechas', ctrlFechas.fechas);

router.get('/posiciones', ctrlMain.posiciones);
router.get('/estadisticas', ctrlMain.estadisticas);
router.get('/videos', ctrlMain.videos);
router.get('/noticias/:id', ctrlNoticias.noticias);
router.get('/editorNoticias', ctrlNoticias.noticiasEditor);


router.post('/guardarResultado', ctrlMain.guardarResultado);
router.post('/cambiarEstilo', ctrlMain.cambiarEstilo);
router.post('/guardarFavorito', ctrlMain.guardarFavorito);

router.post('/nuevaNoticia', ctrlNoticias.guardarNoticia);

module.exports = router;
