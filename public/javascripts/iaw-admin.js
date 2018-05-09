    var jornadaActual = 30;

    $('#lista-equipos').on('click', function (e) {
     mostrarJugadores(e.target.children[0].text);
     $("#modal_equipo_jugador").val(e.target.children[0].text);
   });


  //Código para validar campos al modificar las opciones del torneo
  (function() {
    'use strict';
    window.addEventListener('load', function() {
      var forms = document.getElementsByClassName('form-opciones');
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          else{
            submitOpciones();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();


    //Código para validar campos al agregar un jugador
    (function() {
      'use strict';
      window.addEventListener('load', function() {
        var forms = document.getElementsByClassName('form-jugador');
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
              $("#modalJugador").effect("shake");
            }
            else{
              submitJugador();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();

    //Código para validar los campos al agregar un equipo
    (function(){
      'use strict';
      window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('form-equipo');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
              $("#modalEquipo").effect("shake");
            }
            else{
              submitEquipo();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();

    function abrirJornadas() {

      $.get("/api/fechas", function(data, status) {
        mostrarCalendarioCompleto(data);
      });

    }

    function cargarOpciones(){
     $.get("/api/users", function(data, status) {
      mostrarUsuarios(data);
    });
     $.get("/api/configuraciones", function(objeto, status) {

      var ISODate = new Date(objeto[0].fecha).toISOString();
      const year = objeto[0].fecha.substring(0,4);
      let mes = objeto[0].fecha.substring(5,7);
      let dia = objeto[0].fecha.substring(8,10);


      if (mes.length < 2) 
        month = '0' + month;
      if (dia.length < 2) 
        day = '0' + day;

      var f = dia + "/" + mes + "/" + year;

      $("#cant_equipos").attr("placeholder", objeto[0].equipos).prop('autofocus');
      $("#cant_jugadores").attr("placeholder", objeto[0].cant_jugadores);
      $("#fecha_inicio").attr("placeholder", f);

    });
   }

   function mostrarCalendarioCompleto(data) {

    var pxJornada = data[jornadaActual - 1];
    $("#nroJornada").text("Jornada " + pxJornada.numero);
    mostrarJornadaEnTabla(pxJornada.partido, pxJornada.numero);
  }

  function mostrarUsuarios(users){
   $.each(users, function (i, user) {
     var row = $("<tr></tr>").attr("scope", "row");
     row.append($("<td></td>").text(user.google.name));
     row.append($("<td></td>").text(user.google.email));
     if (user.editor === true)
      row.append($("<td></td>").append($('<input checked></input>').attr("type", "checkbox").attr("id", "check_usuario"+i)));
    else
      row.append($("<td></td>").append($('<input></input>').attr("type", "checkbox").attr("id", "check_usuario"+i)));
    $('#lista_usuarios').append(row);
  });

 }

 function buscarJornada(event) {

//Saco el número de la jornada que está mostrando cuando tocó el boton.
var nroJornadaActual = $("#nroJornada").text().trim();
var nro = parseInt(nroJornadaActual.substring(8, nroJornadaActual.length));
if (event.id === "btn_jornada_siguiente") {
  obtenerJornada(nro + 1);
} else {
  obtenerJornada(nro - 1);
}
}

function obtenerJornada(nro) {
  var j;

  $.get("/api/fechas", function(data, status) {

   $.each(data, function (i, jornada) {
    if (jornada.numero === nro) {
      j = jornada;
    }
  });

   if (j !== undefined) {
    $("#nroJornada").text("Jornada " + j.numero);

    $("#tabla_fixture").empty();

    if (nro === 1)
      $("#btn_jornada_anterior").css("visibility", "hidden");
    else
      $("#btn_jornada_anterior").css("visibility", "visible");

    if (nro === 38)
      $("#btn_jornada_siguiente").css("visibility", "hidden");
    else
      $("#btn_jornada_siguiente").css("visibility", "visible");

    mostrarJornadaEnTabla(j.partido, nro);
  }



});

}

function mostrarJornadaEnTabla(partidos, numero){


  for (index = 0; index < partidos.length; index++) {

    var row = $("<tr></tr>").attr("scope", "row");
    row.append($("<td></td>").text(partidos[index].fecha));
    row.append($("<td></td>").text(partidos[index].horario));
    row.append($("<td></td>").text(partidos[index].equipo_local));

    var resultado = partidos[index].resultado;


    if (resultado === "vs")
      row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text(resultado)));
    else{
      var RL = resultado.substring(0, 1);
      var RV = resultado.substring(1, 2);
      row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text(RL + " - " + RV)));
    }


    row.append($("<td></td>").text(partidos[index].equipo_visitante));
    row.append($("<td></td>").attr("class", "tabla-estadio").text(partidos[index].estadio));
    row.append($("<td></td>").attr("class", "tabla-arbitro").text(partidos[index].arbitro));
    row.append($("<td></td>").attr("class", "tabla-arbitro").text(partidos[index].editor));


    var idPartido = partidos[index]._id;

    row.append($("<td></td>").append($("<span></span>").attr("id", "btn_editar_partido"+ index).attr("class", "oi oi-pencil").attr("onclick", "editarPartido('"+ idPartido + "'," + numero+ "," + index + ");")));

    $("#tabla_fixture").append(row);

  }
}

function ordenarJornadas(data) {

    var jornadas = new Array();

    $.each(data, function (i, obj) {
      jornadas[jornadas.length] = obj;
    });

    var index;
    var j = new Object(); 
    var jActual = jornadas[jornadaActual - 1].partido;
    $("#num-jornada").html("Jornada " + jornadas[jornadaActual - 1].numero);
    for (index = 0; index < jActual.length; ++index) {
      var partido = jActual[index];
      var partidosPorDia;
      if (j.hasOwnProperty(partido.fecha))
        partidosPorDia = j[partido.fecha];
      else {
        partidosPorDia = new Array();
        j[partido.fecha] = partidosPorDia;
      }
      partidosPorDia[partidosPorDia.length] = partido;
    }
    return j;
  }

  function editarPartido(id, jornada, nroFila){




    var col = $('#tabla_fixture tr:eq('+nroFila+')').attr("id", "tr_partido"+nroFila);

    var celda = $(col).children('td:nth-child(1)')[0];  

    var fecha = $(celda).html();
    $(celda).html($("<input></input>").attr("type", "date").attr("id", "input_fecha"+nroFila).attr("placeholder", fecha));
    celda = $(col).children('td:nth-child(2)')[0];  

    var hora = $(celda).html();
    $(celda).html($("<input></input>").attr("type", "time").attr("id", "input_hora"+nroFila).attr("placeholder", hora));


    celda = $(col).children('td:nth-child(6)')[0];  

    var estadio = $(celda).html();
    $(celda).html($("<input></input>").attr("type", "text").attr("id", "input_estadio"+nroFila).attr("placeholder", estadio));


    celda = $(col).children('td:nth-child(7)')[0];  

    var arbitro = $(celda).html();
    $(celda).html($("<input></input>").attr("type", "text").attr("id", "input_arbitro"+nroFila).attr("placeholder", arbitro));

    celda = $(col).children('td:nth-child(8)')[0];  

    var editor = $(celda).html();
    var select = $(celda).html($("<select></select>").attr("id", "input_editor"+nroFila).attr("name", "editor_fecha").attr("text", editor));

    $.get("/api/users", function(objeto, status) {

     $.each(objeto, function (i, editor) {

      if(editor.google.name === editor)
        $("#input_editor"+nroFila).append($("<option selected></option>").html(editor.google.name));
      else
        $("#input_editor"+nroFila).append($("<option></option>").html(editor.google.name));

    });


   });

    $("#btn_editar_partido"+ nroFila).attr("class", "oi oi-check").attr("onclick", "guardar_cambios_partido('"+id +"',"+ jornada +"," + nroFila +");");


  }


  function guardar_cambios_partido(id, jornada, nf){

    var execute = true;

    var nuevaFecha = $("#input_fecha"+nf).val();
    var estadio = $("#input_estadio"+nf).val();
    var arbitro = $("#input_arbitro"+nf).val();
    var editor = $("#input_editor"+nf).val();
    var hora = $("#input_hora"+nf).val();

    if (nuevaFecha == ""){
      $("#input_fecha"+nf).css("border", "2px solid red");
      execute = false;
      $("#input_fecha"+nf).effect("shake", {times: 2, distance: 5}, 500);
    } else {$("#input_fecha"+nf).css("border", "2px solid green");}

    if (estadio == ""){
      $("#input_estadio"+nf).css("border", "2px solid red");
      execute = false;
      $("#input_estadio"+nf).effect("shake", {times: 2, distance: 5}, 500);

    } else {$("#input_estadio"+nf).css("border", "2px solid green");}

    if (arbitro == ""){
      $("#input_arbitro"+nf).css("border", "2px solid red");
      execute = false;
      $("#input_arbitro"+nf).effect("shake", {times: 2, distance: 5}, 500);
    } else {$("#input_arbitro"+nf).css("border", "2px solid green");}

    if (hora == ""){
      $("#input_hora"+nf).css("border", "2px solid red");
      execute = false;
      $("#input_hora"+nf).effect("shake", {times: 2, distance: 5}, 500);
    } else {$("#input_hora"+nf).css("border", "2px solid green");}


    const year = nuevaFecha.substring(0,4);
    let mes = nuevaFecha.substring(5,7);
    let dia = nuevaFecha.substring(8,10);


    if (mes.length < 2) 
      month = '0' + month;
    if (dia.length < 2) 
      day = '0' + day;

    var f = dia + "/" + mes + "/" + year;

    if (execute === true){
      $('#input_fecha'+nf).replaceWith(f);
      $('#input_estadio'+nf).replaceWith(estadio);
      $('#input_arbitro'+nf).replaceWith(arbitro);
      $('#input_hora'+nf).replaceWith(hora);
      $('#input_editor'+nf).replaceWith(editor);
      $("#btn_editar_partido"+ nf).attr("class", "oi oi-pencil").attr("onclick", "editarPartido('"+id +"',"+ jornada +"," + nf + ");");

      var data = {"fecha": f, "hora": hora, "estadio": estadio, "arbitro": arbitro, "id": id, "editor": editor};
      $.post('/admin/editarPartido', data, function(resp) {
       if (resp === "Exito"){
        console.log("exito");
      }
    });

    }

  }

  function confirmarAdmin(){

    var us= $("#usuario").val();
    var ps= $("#password").val();

    if(us === "admin" && ps === "admin123")
      $("#formlogin").attr("type", "hidden");
    else{
      $("#usuario").val = "";
      $("#password").val = "";
      $("#usuario").attr("placeholder", "Usuario");
      $("#password").attr("placeholder", "Contraseña");
    }

  }

  function abrirEquipos() {

    $.get("/api/equipos", function(data, status) {
     mostrarEquipos(data);
   });

  }

  function recargarTabla(){
    var equipo = $("#modal_equipo_jugador").val();
    mostrarJugadores(equipo);
  }

  function mostrarEquipos(data) {

    var objeto = data;

    objeto.sort(
      function (a, b) {
        if (a.nombre_equipo > b.nombre_equipo)
          return 1;
        else
          return -1;
      }
      );
    $.each(objeto, function (i, equipo) {
      addTeam(equipo);
    });

    chequearEquipos();
  }

  function addTeam(equipo){
    img = equipo.escudo;
    var row = $("<a></a>").text(equipo.nombre_equipo).attr("id", equipo.nombre_equipo).append($("<img>").attr("src", img).attr("class", "escudo tabla-equipos").attr("align", "left"));
    var btnEliminar = $("<span></span>").attr("class", "oi oi-x float-right").attr("id", "eliminar_equipo").attr("onclick", "eliminarEquipo('"+ equipo.nombre_equipo +"')");
    var div = $("<div></div>").attr("id", "equipo-lista").attr("class", "list-group-item list-group-item-action").attr("data-toggle", "list").attr("href", "#lista_jugadores").attr("role", "tab").append(row).append(btnEliminar);
    $("#lista-equipos").append(div);

  }

  function eliminarEquipo(nombre){

   $.post('/admin/eliminarEquipo', {"nombre": nombre}, function(resp) {
    if (resp === "Exito"){
      eliminarEquipoLista(nombre);
      chequearEquipos();
    } 
  });
 }

 function eliminarEquipoLista(nombre){

  $('#lista-equipos').children().last().remove();
  $($("#lista-equipos")[0]).children('div').each(function () {
    var obj = $(this)[0];

    var a = ($(this).children(0)[0]);
    if($(a).text() === nombre){
      $(obj).remove();
      return true;
    }
  });
}

function mostrarJugadores(n) {

 $.get("/api/equipos", function(objeto, status) {

   $.each(objeto, function (i, equipo) {
    if (equipo.nombre_equipo === n) {
      $("#lblJugadores").text("Jugadores");
      $("#lista_jugadores tr").remove();
      if (equipo.jugadores.length === 0 || equipo.jugadores === undefined) {
        var row = $("<tr></tr>").attr("scope", "row");
        row.append($("<td></td>").text("No hay jugadores para mostrar.").attr("colspan", "6"));
        $("#lista_jugadores").append(row);
      }
      ;
      $.each(equipo.jugadores, function (j, jugador) {
       addPlayer(jugador);
     });

      var rowfinal = $("<tr></tr>");
      rowfinal.append($("<td></td>").text("+").attr("colspan", "6").attr("class", "bg-danger").attr("id", "boton-agr-jugador").attr("data-toggle", "modal").attr("data-target", "#modalJugador"));

      $("#lista_jugadores").append(rowfinal);
      $("#tabla_jugadores").show();

      return false;
    }
  });       

 });    

}

function addPlayer(jugador){
 var row = $("<tr></tr>").attr("scope", "row");
 row.append($("<td></td>").text(jugador.dorsal));
 row.append($("<td></td>").text(jugador.nombre_jugador));
 row.append($("<td></td>").text(jugador.nacionalidad));
 row.append($("<td></td>").text(jugador.edad));
 row.append($("<td></td>").text(jugador.posicion));
 row.append($("<td></td>").append($("<span></span>").attr("class", "oi oi-x").attr("id", "eliminar_jugador").attr("onclick", "eliminarJugador("+jugador.dorsal+")")));
 $("#lista_jugadores").append(row);
}


$(function() {
  $('#modalEquipo').on('show.bs.modal', function(){

                $('#modalEquipo').find('form')[0].reset();
                $("#equipo-agregado").hide();
                $("#equipo-repetido").hide();
              });
   });


//POST para agregar equipo nuevo y actualizar la lista de equipos
function submitEquipo() {
 var nom = $('#nombre_equipo').val();
 var mov = $('#nombre_equipo_movil').val();
 var esc = $('#escudo_equipo').val();
   event.preventDefault(); // Stops browser from navigating away from page
   var data = { "nombre_equipo" : nom, "nombre_equipo_movil": mov, "escudo_equipo": esc};
   $.post('/admin/nuevoEquipo', data, function(resp) {
     if (resp === "Exito"){
      agregarEquipo(data);
      $('#equipo-agregado').show();
      $('#equipo-repetido').hide();

    }
    else{
      $('#equipo-repetido').show();
      $('#equipo-agregado').hide();
    }

  });
 };

//POST para agregar un jugador nuevo y actualizar la lista de jugadores
function submitJugador(){
 var nom_equipo = $("#modal_equipo_jugador").val();
 var nom_jugador = $('#nombre-jugador').val();
 var nac = $('#nacionalidad-jugador').val();
 var dor = $('#dorsal-jugador').val();
 var pos = $('#posicion-jugador').val();
 var edad = calcularEdad($('#fecha-jugador').val());
   event.preventDefault(); // Stops browser from navigating away from page
   var data = { "nombre_equipo" : nom_equipo, "nombre_jugador" : nom_jugador, "nacionalidad" : nac, "dorsal" : dor, "posicion" : pos, "edad": edad };
   $.post('/admin/nuevoJugador', data, function(resp) {
     if (resp === "Exito"){
       agregarJugador(data);
       $('#jugador-agregado').show();
       $('#jugador-repetido').hide();
     }
     else{
      $('#jugador-repetido').show();
      $('#jugador-agregado').hide();
    }
  });
 };

//POST para agregar las nuevas opciones del torneo
function submitOpciones(){
 var cant_equipos = $("#cant_equipos").val();
 var cant_jugadores = $("#cant_jugadores").val();
 var fecha_inicio = $("#fecha_inicio").val();

 var seleccionados = new Array();
 var i = 0;
 $('#tabla_usuarios > tbody  > tr' ).each(function() {
  var check = $("#check_usuario"+i).is(":checked");
  if (check)
    seleccionados.push($(this).children('td:nth-child(2)').text());
});

   event.preventDefault(); // Stops browser from navigating away from page
   var data = { "equipos" : cant_equipos, "cant_jugadores" : cant_jugadores, "fecha": fecha_inicio, "seleccionados": JSON.stringify(seleccionados)};
   $.post('/admin/guardarOpciones', data, function(resp) {
   });
 }



 function calcularEdad(fecha){
  var cumpleaños = +new Date(fecha);
  var edad = ~~((Date.now() - cumpleaños) / (31557600000));
  return edad;
}

function actModal(){

  $.get("/api/configuraciones", function(objeto, status) {

    var ISODate = new Date(objeto[0].fecha).toISOString();
    const year = objeto[0].fecha.substring(0,4);
    let mes = objeto[0].fecha.substring(5,7);
    let dia = objeto[0].fecha.substring(8,10);


    if (mes.length < 2) 
      month = '0' + month;
    if (dia.length < 2) 
      day = '0' + day;

    var f = dia + "/" + mes + "/" + year;

    $("#cant_equipos").attr("placeholder", objeto[0].equipos).prop('autofocus');
    $("#cant_jugadores").attr("placeholder", objeto[0].cant_jugadores);
    $("#fecha_inicio").attr("placeholder", f);

  });
  
}

function agregarEquipo(equipo){

 $('#lista-equipos').children().last().remove();

 addTeam(equipo);
 chequearEquipos();
}

function agregarJugador(data){

 $('#tabla_jugadores tr:last').remove();
 var t = $('#tabla_jugadores tr:last td:first-child').html();
 if (t === "No hay jugadores para mostrar.")
  $('#tabla_jugadores tr:last').remove();

addPlayer(data);

var rowfinal = $("<tr></tr>");
rowfinal.append($("<td></td>").text("+").attr("colspan", "6").attr("class", "bg-danger").attr("id", "boton-agr-jugador").attr("data-toggle", "modal").attr("data-target", "#modalJugador"));

$("#lista_jugadores").append(rowfinal);
}

function eliminarJugador(dorsal){  

 var equipo = $("#modal_equipo_jugador").val();
 $.post('/admin/eliminarJugador', {"equipo": equipo, "dorsal": dorsal}, function(resp) {
  if (resp === "Exito"){
    eliminarJugadorLista(dorsal);
  }
});

}

function eliminarJugadorLista(dorsal){

  $('#tabla_jugadores > tbody  > tr' ).each(function() {
    var d = ($(this).children('td:first').html());
    if (parseInt(d) === dorsal){
      $(this).remove();
    }
  });
}

function chequearEquipos(){

  var cant;
  $.get("/api/equipos", function(data, status) {
    cant = data.length;
    var rowfinal;
    if(cant < 20){
      rowfinal = $("<a></a>").text("+").attr("class", "list-group-item list-group-item-action bg-danger text-light").attr("id", "btnAgregarEquipo").attr("data-toggle", "modal").attr("data-target", "#modalEquipo");
      $("#guardarEquipo").prop('disabled', false);

    }
    else{
      rowfinal = $("<a></a>").text("Generar Fixture").attr("class", "list-group-item list-group-item-action bg-danger text-light").attr("onclick", "genfix();").attr("id", "btnGenerarFixture");
      $("#guardarEquipo").prop('disabled', true);

    }
    $('#lista-equipos').append(rowfinal);
  });

}


function genfix(){

  var data;
  var arr = new Object();
  arr["Barcelona"]= "Camp Nou";
  arr["Real Madrid"] = "S. Bernabeu";
  arr["Atlético"] = "Metropolitano";
  arr["Valencia"] = "Mestalla";
  arr["Villareal"] = "Estadio de la Cerámica";
  arr["Sevilla"] = "Sánchez Pizjuán";
  arr["Betis"] = "Benito Villamarín";
  arr["Athletic"] = "San Mamés";
  arr["Real Sociedad"] = "Anoeta";
  arr["Espanyol"] = "Cornella El Prat";
  arr["Celta"] = "Balaídos";
  arr["Getafe"] = "Getafe";
  arr["Levante"] = "Ciudad de Valencia";
  arr["Eibar"] = "Ipurúa";
  arr["Alavés"] = "Mendizorroza";
  arr["Leganés"] = "Butarque";
  arr["Girona"] = "Montilivi";
  arr["Málaga"] = "La Rosaleda";
  arr["Las Palmas"] = "Gran Canaria";
  arr["Deportivo"] = "Riazor";
  
  $.get("/api/equipos", function(objeto, status) {
    data = fix(objeto); 
    fixture = fixVuelta(data);

    var i, j;
    for(i = 0; i< fixture.length; i++){
      var fecha = fixture[i][0];
      var fechaCompleta = new Array();
      for(j = 0; j< fixture[0][0].length; j++){

        var partido = fixture[i][0][j];

        var datos = {"id_partido": j ,"equipo_local": partido[0], "equipo_visitante": partido[1], "fecha": partido.fecha, "horario": partido.horario, "estadio": arr[partido[0]], "arbitro": 'A Confirmar', "resultado": 'vs', "editor": "No Asignado"};
        fechaCompleta.push(datos);
      }

      $.post('/admin/armarFixture',{"numero": (i+1), "partidos": JSON.stringify(fechaCompleta)}, function(resp) {});

    }

  }); 

}

function convertir(fixture){

  var i, j;
  var jornada, partidos, juego;
  var fix = new Array();
    for (i = 0; i < fixture.length; i++){
      jornada = '{"numero": '+(i+1)+',';
      partidos = '"partidos" : [';
      for(j = 0; j < fixture[0][0].length; j++){
        var partido = fixture[i][0][j];


        juego = "{\"id_partido\":" + j + ", \"fecha\":" + partido.fecha + ", \"horario\":" + partido.horario+ ", ";
        juego += "\"equipo_local\": " + partido[0]+ ", \"equipo_visitante\":" +  partido[1]+ ", \"estadio\": \"Estadio 1\", \"arbitro\": \"Arbitro 1\", \"resultado\": \"--\"}";
        partidos += juego;
        if(j < fixture[0][0].length - 1)
          partidos = partidos + ",";
        juego = "";
      }
        partidos += "]";

        jornada += partidos;

        jornada += "}";

        if(i < fixture.length)
          jornada += ",";

        fix.push(jornada);
        jornada = "";
        partidos = "";
      }

      return fix;
    }

    function fixVuelta(jornadas){

      var i,j,k;

      var arreglo = new Array();
      for (i = 0; i < (jornadas.length*2); i++){
       if (i < 19)
        arreglo.push(jornadas[i]);
      else
        arreglo.push(vueltaJornada(jornadas[i-19]));
    }

    var today = new Date().getTime();
    var date = new Date(today);
    var semana = 86400000 * 7;
    var proxima = today;
    var hora = 14;
    var k = 0;
    for(i = 0; i < arreglo.length; i++){
      for(j = 0; j < arreglo[0][0].length; j++){


        if (k == 3){
          proxima+=86400000;
          k = 0;
          hora = 14;
        }
        else{
          k++; 
          hora+=2;
        }

        var proximaFecha = new Date(proxima);
        var day = ("0" + proximaFecha.getDate()).slice(-2);
        var month = ("0" + (proximaFecha.getMonth() + 1)).slice(-2)

        var dia = day + '/' + month + '/' + proximaFecha.getFullYear();
        var horario = hora+':'+'00';
        arreglo[i][0][j].fecha = dia;
        arreglo[i][0][j].horario = horario;
      }
      proxima+=semana;
      
    }

    return arreglo;
  }

  function vueltaJornada(jornadas){
    var arreglo = new Array();

    for (var i = 0; i < jornadas.length; i++){
      arreglo.push(new Array());

    }
    for (var i = 0; i < jornadas[0].length; i++){
      arreglo[0].push(intercambiar(jornadas[0][i]));
    }
    return arreglo;
  }

  function fix(equipos){

    var n = equipos.length;
    var i, j, h;
    var jornadas = n - 1;
    var partidosXJornada = n / 2;
    var salida = new Array();

    for(h = 0; h < jornadas; h++){
      salida.push(new Array());
    }

    var local, visita;


    for(i = 0; i < jornadas; i++){
      for(j = 0; j < partidosXJornada; j++){
        local = (i + j) % (n - 1);
        visita = (n - 1 - j + i) % (n - 1);
        if ( j == 0)
          visita = n - 1;
        var par = [equipos[local].nombre_equipo, equipos[visita].nombre_equipo];

        salida[i].push(par);
      }
    }

     //Intercalar
     var intercalar = new Array();
     for (i = 0; i < jornadas; i++){
      intercalar.push(new Array());
    }

    var par = 0;
    var impar = n / 2;
    for (i = 0; i < salida.length; i++){
      if (i% 2 == 0)
        intercalar[i].push(salida[par++]);
      else
        intercalar[i].push(salida[impar++]);
    }

    salida = intercalar;

    for (i = 0; i < salida.length; i++){
      if (i % 2 == 1)
        salida[i][0][0] = intercambiar(salida[i][0][0]);
    }



    return salida;

  }




  function intercambiar(par){
    return [par[1], par[0]];
  }

  function cargarNoticias(){

   $.get("/api/noticias", function(data, status) {
    if(data.length === 0){
      var row = $("<tr></tr>").attr("scope", "row");
      row.append($("<td></td>").text("No hay noticias para mostrar").attr("colspan", "6"));
      $("#lista_noticias").append(row);
    }
    else{
      $.each(data, function (i, noticia) {

        var estado, subida, bajada;
        if(noticia.seleccionada){ 
          estado = "Publicada";
          subida = false;
          bajada = true;
        }
        else{
          estado = "No Publicada";
          subida = true;
          bajada = false;
        }

        var row = $("<tr></tr>").attr("scope", "row");
        row.append($("<td></td>").text(noticia.titulo));
        row.append($("<td></td>").text(noticia.fecha));
        row.append($("<td></td>").text(estado));  
        row.append($("<td></td>").text(noticia.categoria));  

        row.append($("<td></td>").append($("<span></span>").attr("class", "oi oi-plus").attr("id", "publicar_noticia").attr("onclick", "publicar_noticia('"+ noticia.titulo +"', true);")));
        row.append($("<td></td>").append($("<span></span>").attr("class", "oi oi-minus").attr("id", "bajar_noticia").attr("onclick", "publicar_noticia('"+ noticia.titulo +"', false);")));
        row.append($("<td></td>").append($("<span></span>").attr("class", "oi oi-x").attr("id", "eliminar_noticia").attr("onclick", "eliminarNoticia('"+ noticia.titulo +"');")));

        $("#lista_noticias").append(row);
      }); 

    }
    $("#tabla_noticias").show();

  });   

 }


 function publicar_noticia(t, estado){


  $.post('/admin/alta_baja_noticia', {"titulo": t, "estado": estado}, function(resp) {
    if (resp === "Exito"){
      actualizarNoticias(t, estado);
    }
  });

}


function eliminarNoticia(t){


 $.post('/admin/eliminarNoticia', {"titulo": t}, function(resp) {
  if (resp === "Exito"){
    eliminarNoticiaLista(t);
  }
});



}

function eliminarNoticiaLista(t){

  $('#tabla_noticias > tbody  > tr' ).each(function() {
    var d = ($(this).children('td:first').html());



    if (d === t){
      $(this).remove();
    }
  });
}

function actualizarNoticias(t, estado){

 $('#tabla_noticias > tbody  > tr' ).each(function() {

  var d = ($(this).children('td:first').html());
  var celda = $(this).children('td:nth-child(3)');

  var est;
  if(estado)
    est = "Publicada";
  else
    est = "No Publicada";

  if (d === t)
   $(celda).html(est);

});

}

