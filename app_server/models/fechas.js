const mongoose = require('mongoose');

const partidoSchema = new mongoose.Schema({
    id_partido:{
        type : Number
    },
    equipo_local: {
        type: String,
        required: true
    },
    equipo_visitante: {
        type: String,
        required: true
    },
    fecha: {
        type: String,
        required: true
    },
    horario: {
        type: String,
        required: true
    },
    estadio: {
        type: String,
        default: "A confirmar"
    },
    arbitro: {
        type: String,
        default: "A confirmar"
    },
    resultado: {
        type: String,
        default: "vs"
    },
    editor:{
        type: String, 
        default : "No Asignado"
    }
})

const fechaSchema = new mongoose.Schema({
    numero: Number,
    partido: [partidoSchema]
});

module.exports = mongoose.model('Fecha', fechaSchema);