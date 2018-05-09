var express = require('express');
var router = express.Router();

const ctrlAdmin = require('../controllers/admin');
const ctrlEquipos = require('../controllers/equipos');
const ctrlFechas = require('../controllers/fechas');

router.get('/', ctrlAdmin.indexAdmin);
router.get('/equipos', ctrlAdmin.equipos);
router.get('/noticias', ctrlAdmin.noticias);
router.get('/fechas', ctrlAdmin.fechas);
router.get('/opciones', ctrlAdmin.opciones)

router.post('/nuevoJugador', ctrlEquipos.nuevoJugador);
router.post('/nuevoEquipo', ctrlEquipos.nuevoEquipo);
router.post('/guardarOpciones', ctrlAdmin.guardarOpciones);
router.post('/eliminarEquipo', ctrlEquipos.eliminarEquipo);
router.post('/eliminarJugador', ctrlEquipos.eliminarJugador);
router.post('/editarPartido', ctrlFechas.editarPartido);
router.post('/eliminarNoticia', ctrlAdmin.eliminarNoticia);
router.post('/alta_baja_noticia', ctrlAdmin.alta_baja_noticia);
router.post('/armarFixture', ctrlAdmin.armarFixture);
router.post('/guardarFavorito', ctrlAdmin.guardarFavorito);
router.post('/cambiarEstilo', ctrlAdmin.cambiarEstilo);
router.post('/guardarResultado', ctrlAdmin.guardarResultado);

module.exports = router;
