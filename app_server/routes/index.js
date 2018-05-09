var express = require('express');
var router = express.Router();

const ctrlMain = require('../controllers/main');
const ctrlEquipos = require('../controllers/equipos');
const ctrlFechas = require('../controllers/fechas');

router.get('/', ctrlMain.index);
router.get('/equipos', ctrlEquipos.equipos);
router.get('/fechas', ctrlFechas.fechas);
router.get('/posiciones', ctrlMain.posiciones);
router.get('/estadisticas', ctrlMain.estadisticas);
router.get('/noticias/:id', ctrlMain.noticias);

//router.post('guardarFavorito', ctrlMain.guardarFavorito);

module.exports = router;
