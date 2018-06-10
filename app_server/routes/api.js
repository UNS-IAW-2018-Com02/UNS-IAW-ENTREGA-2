var express = require('express');
var router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/equipos', apiController.getEquipos);
router.get('/fechas', apiController.getFechas);
router.get('/noticias', apiController.getNoticias);
router.get('/configuraciones', apiController.getConfiguracion);
router.get('/partidosEditor', apiController.getPartidosEditor);
router.get('/users', apiController.getUsuarios);
router.get('/user_data', apiController.getCurrentUser);


module.exports = router;