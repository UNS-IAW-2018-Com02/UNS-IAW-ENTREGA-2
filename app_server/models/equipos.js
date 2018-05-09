const mongoose = require('mongoose');

const jugadorSchema = new mongoose.Schema({
    dorsal: {
        type: Number,
        required: true
    },
    nombre_jugador: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    nacionalidad: {
        type: String,
        required: true
    },
    posicion: {
        type: String,
        required: true
    },
    goles: {
        type: Number,
        'default': 0
    },
    asistencias: {
        type: Number,
        'default': 0
    },
    amarillas: {
        type: Number,
        'default': 0
    },
    rojas: {
        type: Number,
        'default': 0
    }
});

const equipoSchema = new mongoose.Schema({
    nombre_equipo: {
        type: String,
        required: true
    },
    nombre_equipo_movil:{
    	type: String,
    	required: true
    },
    escudo: {
    	//data: Buffer,
    	//contentType: String
        type: String,
        required: true
    },
    partidos_jugados:{
    	type: Number,
    	'default': 0
    },
     partidos_ganados:{
    	type: Number,
    	'default': 0
    },
     partidos_empatados:{
    	type: Number,
    	'default': 0
    },
     partidos_perdidos:{
    	type: Number,
    	'default': 0
    },
     goles_a_favor:{
    	type: Number,
    	'default': 0
    },
     goles_en_contra:{
    	type: Number,
    	'default': 0
    },
    jugadores: [jugadorSchema]

});


module.exports = mongoose.model('Equipo', equipoSchema);
