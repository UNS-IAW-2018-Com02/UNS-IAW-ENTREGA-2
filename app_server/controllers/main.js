const index = function (req, res) {
      res.render('index', {title: 'La Liga', user : req.user});
};

const noticias = function (req, res) {
      res.render('noticias', {title: 'La Liga',  user : req.user});
      console.log(req.params.id)
};

const posiciones = function (req, res) {
      res.render('posiciones', {title: 'La Liga', user : req.user});
};

const estadisticas = function (req, res) {
      res.render('estadisticas', {title: 'La Liga', user : req.user});
};

module.exports = {
      index,
      noticias, 
      posiciones,
      estadisticas
}; 
