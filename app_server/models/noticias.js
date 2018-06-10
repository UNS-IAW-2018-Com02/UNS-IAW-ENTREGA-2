const mongoose = require('mongoose');

const noticiaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    sintesis: {
        type: String,
        'default': ""
    },
    cuerpo: {
        type: String,
        required: true
    },
    imagen: {
        //data: Buffer,
        //contentType: String
        type: String
    },
    fecha: {
        type: String,
        required: true
    },
    seleccionada: {
        type: Boolean,
        required: true
    },
    video: {
        type: String
    }
    
    
})



module.exports = mongoose.model('Noticia', noticiaSchema);