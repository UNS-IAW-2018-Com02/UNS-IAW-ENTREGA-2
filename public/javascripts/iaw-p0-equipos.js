
//Tablas de posiciones.

function abrirTablaReducida() {

 $.get("/api/equipos", function(data, status){

  var tablaOrdenada = ordenarTabla(data);
  mostrarTablaReducida(tablaOrdenada);
});
}

//Muestra la tabla de posiciones.
function abrirTabla() {

  $.get("/api/equipos", function(data, status){

    var tablaOrdenada = ordenarTabla(data);
    mostrarTabla(tablaOrdenada);
  });
}

//Rellena la tabla con los datos.
function mostrarTabla(equipos) {


  $.get("/api/user_data", function(data, status) {
    var img;
    for (index = 0; index < equipos.length; index++) {
      img = equipos[index].escudo;
      var row = $("<tr></tr>").attr("scope", "row");
      row.append($("<td></td>").text(index + 1));
      row.append($("<td></td>").attr("class", "text-left table-club").append($("<span></span>").text(equipos[index].nombre_equipo).attr("class", "nombre-equipo-tabla")).append($("<span></span>").text(equipos[index].nombre_equipo_movil).attr("class", "nombre-equipo-movil")).append($("<img>").attr("src", img).attr("class", "escudo-tabla").attr("align", "left")));
      row.append($("<td></td>").text(equipos[index].partidos_jugados));
      row.append($("<td></td>").text(equipos[index].partidos_ganados));
      row.append($("<td></td>").text(equipos[index].partidos_empatados));
      row.append($("<td></td>").text(equipos[index].partidos_perdidos));
      row.append($("<td></td>").text(equipos[index].puntos).css("font-weight", "bold"));
      row.append($("<td></td>").text(equipos[index].goles_a_favor));
      row.append($("<td></td>").text(equipos[index].goles_en_contra));
      row.append($("<td></td>").text(equipos[index].dif_gol));

      if (!jQuery.isEmptyObject(data))
        if (data.user.equipo_favorito === equipos[index].nombre_equipo)
          row.attr("class", "equipo_fav");

        $("#tabla_pos_completa").append(row);
      }
    }); 
}

//Rellena la tabla en el index.
function mostrarTablaReducida(equipos) {

  $.get("/api/user_data", function(data, status) {

    var img;
    for (index = 0; index < equipos.length; index++) {
      img = equipos[index].escudo;
      var row = $("<tr></tr>").attr("scope", "row").attr("id", "row_"+index);
      row.append($("<td></td>").text(index + 1));
      row.append($("<td></td>").text(equipos[index].nombre_equipo).append($("<img>").attr("src", img).attr("class", "escudo tabla-laliga").attr("align", "left")));
      row.append($("<td></td>").text(equipos[index].puntos));
      row.append($("<td></td>").text(equipos[index].partidos_jugados));
      row.append($("<td></td>").text(equipos[index].dif_gol));
      row.append($("<td></td>").append($('<span></span>').attr("id", "star_"+index).attr("class", "star oi oi-star").attr("onclick", "guardarFavorito('"+equipos[index].nombre_equipo+"')")));

      if (!jQuery.isEmptyObject(data))
        if (data.user.equipo_favorito === equipos[index].nombre_equipo)
          row.attr("class", "equipo_fav");
        $("#tabla_pos").append(row);

      }
    }); 
}


//Equipos

function abrirEquipos() {

  $.get("/api/equipos", function(data, status){
    mostrarEquipos(data);
  });
}

//Muestra los equipos en tabla.
function mostrarEquipos(data) {

  var tabla = "#tabla_equipos";
  var cont = 1;
  var img;

  //ordena los equipos según el nombre.

  data.sort(
    function (a, b) {
      if (a.nombre_equipo > b.nombre_equipo)
        return 1;
      else
        return -1;
    }
    );

  $.each(data, function (i, equipo) {
    if (cont > 5)
      cont = 1;
    img = equipo.escudo;
    var row = $("<tr></tr>").attr("scope", "row");
    row.append($("<td></td>").attr("onclick", "abrirJugadores(\"" + equipo._id + "\", this);").append($("<span></span>").text(equipo.nombre_equipo).attr("class", "nombre-equipo")).append($("<img>").attr("src", img).attr("class", "escudo tabla-equipos").attr("align", "left")));

    $(tabla + cont).append(row);
    cont++;
  });
}


//Favoritos

//Marca un equipo como favorito y guarda el equipo como favorito de ese usuario.
function guardarFavorito(equipo){
  $.get("/api/user_data", function(data, status) {
            //Si no hay un usuario logueado, solo marca el favorito
            if (jQuery.isEmptyObject(data))
              marcarFavorito(equipo);
            else{
            //Si hay un usuario logueado, marca el favorito y lo guarda en la BD
            datos = {"equipo": equipo};
            $.post('guardarFavorito', datos, function(resp) {
             if (resp === "Exito"){
              marcarFavorito(equipo);
            }
            else if (resp === "Exists"){
              eliminarFavorito(equipo);
            }
          });
          }

        });
}


//Marca el equipo favorito en la tabla.
function marcarFavorito(equipo){
  $('#tabla_posiciones > tbody  > tr' ).each(function() {
    if ($(this).children('td:nth-child(2)').text() === equipo)
      $(this).attr("class", "equipo_fav");
    else
      $(this).removeAttr("class");
  });
}


//Elimina un equipo que estuviera como favorito.
function eliminarFavorito(equipo){
  $('#tabla_posiciones > tbody  > tr' ).each(function() {
    if ($(this).children('td:nth-child(2)').text() === equipo)
      $(this).removeAttr("class");
  });
}

//Ordenar

//Ordena la tabla de posiciones según puntos, diferencia de gol, goles a favor, en ese orden.
function ordenarTabla(data) {
  var index;
  var equipos = new Array();
  $.each(data, function (i, obj) {
    var equipo = obj;
    equipo.puntos = equipo.partidos_ganados * 3 + equipo.partidos_empatados;
    equipo.dif_gol = equipo.goles_a_favor - equipo.goles_en_contra;
    equipos[equipos.length] = equipo;
  });

  equipos.sort(
    function (a, b) {
      if (a.puntos < b.puntos)
        return 1;
      else if (a.puntos > b.puntos)
        return -1;
      else {
        if ((a.goles_a_favor - a.goles_en_contra) < (b.goles_a_favor - b.goles_en_contra))
          return 1;
        else if ((a.goles_a_favor - a.goles_en_contra) > (b.goles_a_favor - b.goles_en_contra))
          return -1;
        else {
          if (a.goles_a_favor > b.goles_a_favor)
            return 1;
          else if (a.goles_a_favor < b.goles_a_favor)
            return -1;
          else
            return 0;
        }
      }
    }
    );
  return equipos;
}