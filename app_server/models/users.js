var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id : String, 
  displayName: String,
  editor: {
  	type : Boolean,
  	default : false
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  estilo : {
  	type : Number, 
  	default : 0
  },
  equipo_favorito :{
  	type:  String,
  	default : ''
  },
  partidos : {
  	type : [String],
  	default : []
  }
});


module.exports = mongoose.model('User', UserSchema);