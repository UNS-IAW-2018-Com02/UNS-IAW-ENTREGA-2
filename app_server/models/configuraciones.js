const mongoose = require('mongoose');

const configuracionSchema = new mongoose.Schema({
    equipos: {
        type: Number,
        required: true
    },
    cant_jugadores:{
    	type: Number,
    	required: true
    },
    fecha: {
        type: Date,
        required: true
    }

});



module.exports = mongoose.model('Configuracion', configuracionSchema);