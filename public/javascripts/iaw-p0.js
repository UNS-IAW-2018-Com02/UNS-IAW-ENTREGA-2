var tabla;
var listaJornadas;
var equipos;
var jornadaDeseada;
var jornadaActual = 30;

$(document).ready(function () {

         $.get("/api/user_data", function(data, status){
            //Si ningun usuario inicio sesión
            if(jQuery.isEmptyObject(data)){
                var guardado = localStorage.getItem("style");
                if (guardado === null) {
                    var estilo = "/stylesheets/iaw-p0.css";
                    $("#estilo").attr("href", estilo);
                    localStorage.setItem("style", estilo);
                } else
                    $("#estilo").attr("href", guardado);
             }           
        }); 
});

function cambiarEstilo() {

    $.get("/api/user_data", function(data, status){
        //Si un usuario inicio sesión
        if(!jQuery.isEmptyObject(data)){
            if (data.user.estilo === 0){
                 $('#estilo').attr('href', '/stylesheets/iaw-p0-est2.css');
                 $.post("/admin/cambiarEstilo", {"estilo": 1})
            }
            //Ningun usuario inicio sesión
            else{
                $('#estilo').attr('href', '/stylesheets/iaw-p0.css');
                 $.post("/admin/cambiarEstilo", {"estilo": 0})
            }
        }
        else{
            var guardado = localStorage.getItem("style");
            if (guardado === '/stylesheets/iaw-p0.css'){
                localStorage.setItem("style", '/stylesheets/iaw-p0-est2.css');
                $('#estilo').attr('href', '/stylesheets/iaw-p0-est2.css');
            }
            else{
                localStorage.setItem("style", '/stylesheets/iaw-p0.css');
                $('#estilo').attr('href', '/stylesheets/iaw-p0.css');
            }

        }
    });
}

function abrirIndex() {

    abrirTablaReducida();
    abrirJornadaIndex();
    abrirNoticias();
}

function abrirTablaReducida() {

     $.get("/api/equipos", function(data, status){

        var tablaOrdenada = ordenarTabla(data);
        mostrarTablaReducida(tablaOrdenada);
    });
}


function abrirTabla() {

    $.get("/api/equipos", function(data, status){

        var tablaOrdenada = ordenarTabla(data);
        mostrarTabla(tablaOrdenada);
    });
}


function abrirJugadores(id, cell) {

    $("#tabla_equipos1").find("*").css('backgroundColor', "");
    $("#tabla_equipos2").find("*").css('backgroundColor', "");
    $("#tabla_equipos3").find("*").css('backgroundColor', "");
    $("#tabla_equipos4").find("*").css('backgroundColor', "");
    $("#tabla_equipos5").find("*").css('backgroundColor', "");

    var estiloActual = localStorage.getItem("style");
    if (estiloActual === "/stylesheets/iaw-p0.css") {
        cell.style.backgroundColor = "#99FF99";
    } else {
        cell.style.backgroundColor = "red";
    }

    $.get("/api/equipos", function(data, status){
        mostrarJugadores(data, id);    
    });
}


function abrirEquipos() {

    $.get("/api/equipos", function(data, status){
        mostrarEquipos(data);
    });
}


function abrirJornadas() {

    $.get("/api/fechas", function(data, status) {
        mostrarCalendarioCompleto(data);
     });

}

function abrirJornadaIndex() {

    $.get("/api/fechas", function(data, status) {
           mostrarCalendario(ordenarJornadas(data));
     });

}

function abrirNoticias() {

     $.get("/api/noticias", function(data, status) {
            mostrarNoticiasReducidas(data);     
    });
}

function agregarDia(fecha) {//localhost:3000/api/noticias
    var subtitulo = $("<th></th>").attr("colspan", "3").attr("class", "text-left table-dark").text(fecha);
    $("#calendario").append($("<tr></tr>").append(subtitulo));
}

function agregarPartido(partido) {
    var row = $("<tr></tr>").attr("class", "partido-cal");
    row.append($("<td></td").text(partido.equipo_local));
    row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text(partido.horario)));
    row.append($("<td></td").text(partido.equipo_visitante));
    $("#calendario").append(row);
}

function buscarEstadisticas() {

    buscarJugadores();

    estadisticasPorEquipo();

}

function buscarJugadores() {

    $.get("/api/equipos", function(data, status){

        var jugadores = new Array();

        $.each(data, function (i, equipo) {

                $.each(equipo.jugadores, function (j, jugador) {
                    jugador.equipo = equipo.escudo;
                    jugadores[jugadores.length] = jugador;
                });
            });

            ordenarEstadisticas(jugadores, "goles");
            mostrarMaximos(jugadores, "goles");
            ordenarEstadisticas(jugadores, "asistencias");
            mostrarMaximos(jugadores, "asistencias");
            ordenarEstadisticas(jugadores, "amarillas");
            mostrarMaximos(jugadores, "amarillas");
            ordenarEstadisticas(jugadores, "rojas");
            mostrarMaximos(jugadores, "rojas");

    });
}

function buscarJornada(event) {

//Saco el número de la jornada que está mostrando cuando tocó el boton.
    var nroJornadaActual = $("#nroJornada").text().trim();
    var nro = parseInt(nroJornadaActual.substring(8, nroJornadaActual.length));
    if (event.id === "btn_jornada_siguiente") {
        obtenerJornada(nro + 1);
        jornadaActual = nro+1;
    } else {
        obtenerJornada(nro - 1);
        jornadaActual = nro-1;
    }
    
}

function mostrarMaximosEquipos(array, t) {
    var nom_tabla;
    var subs;
    if (t === "goles_a_favor") {
        nom_tabla = "#tabla_gf_equipo";
        subs = "Goles a favor";
    } else if (t === "goles_en_contra") {
        nom_tabla = "#tabla_gc_equipo";
        subs = "Goles en contra";
    } else {
        nom_tabla = "#tabla_promedio_gol";
        subs = "Promedio de Gol";
    }

    var index;
    var img;

    var subtitulo = $("<th></th>").attr("colspan", "3").attr("class", "text-center table-dark").text(subs);
    $(nom_tabla).append($("<tr></tr>").append(subtitulo));
    for (index = 0; index < 5; index++) {
        var row = $("<tr></tr>").attr("scope", "row");
        img = array[index].escudo;
        row.append($("<td></td>").text(index + 1));
        row.append($("<td></td>").text(array[index].nombre_equipo).append($("<img>").attr("src", img).attr("class", "escudo tabla-laliga").attr("align", "left")));
        row.append($("<td></td>").text(array[index][t]));
        $(nom_tabla).append(row);
    }

}


function mostrarMaximos(array, t) {
    var nom_tabla;
    var subs;
    if (t === "goles") {
        nom_tabla = "#tabla_goleadores";
        subs = "Goleadores";
    } else if (t === "asistencias") {
        nom_tabla = "#tabla_asistencias";
        subs = "Asistencias";
    } else if (t === "amarillas") {
        nom_tabla = "#tabla_amarillas";
        subs = "Tarjetas Amarillas";
    } else {
        nom_tabla = "#tabla_rojas";
        subs = "Tarjetas Rojas";
    }

    var index;
    var img;

    var subtitulo = $("<th></th>").attr("colspan", "3").attr("class", "text-center table-dark").text(subs);
    $(nom_tabla).append($("<tr></tr>").append(subtitulo));
    for (index = 0; index < 10; index++) {
        var row = $("<tr></tr>").attr("scope", "row");
        img = array[index].equipo;
        row.append($("<td></td>").text(index + 1));
        row.append($("<td></td>").text(array[index].nombre_jugador).append($("<img>").attr("src", img).attr("class", "escudo tabla-laliga").attr("align", "left")));
        row.append($("<td></td>").text(array[index][t]));
        $(nom_tabla).append(row);
    }

}


function mostrarJugadores(equipos, id) {
    $.each(equipos, function (i, equipo) {
        if (equipo._id === id) {
            $("#tabla_jugadores_body tr").remove();
            if (equipo.jugadores === undefined) {
                var row = $("<tr></tr>").attr("scope", "row");
                row.append($("<td></td>").text("No hay jugadores para mostrar.").attr("colspan", "8"));
                $("#tabla_jugadores_body").append(row);
            }
            ;
            $.each(equipo.jugadores, function (j, jugador) {
                var row = $("<tr></tr>").attr("scope", "row");
                row.append($("<td></td>").text(jugador.dorsal));
                row.append($("<td></td>").text(jugador.nombre_jugador));
                row.append($("<td></td>").text(jugador.nacionalidad));
                row.append($("<td></td>").text(jugador.edad));
                row.append($("<td></td>").text(jugador.posicion));
                row.append($("<td></td>").text(jugador.goles));
                row.append($("<td></td>").text(jugador.asistencias));
                row.append($("<td></td>").text(jugador.amarillas));
                row.append($("<td></td>").text(jugador.rojas));
                $("#tabla_jugadores_body").append(row);
            });

            return false;
        }
    });
    $("#tabla_jugadores").show();
}

function mostrarEquipos(data) {

    var tabla = "#tabla_equipos";
    var cont = 1;
    var img;

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


function mostrarNoticiasReducidas(noticias) {
    var index = 0;
    var cant = 0;
    $.each(noticias, function (i, noticia) {
        if(cant < 6 && noticia.seleccionada){
            if (noticia.categoria === "principal") {
                var c;
                var it;
                if (index === 0) {
                    c = "active";
                    it = "carousel-item active";
                } else {
                    c = "";
                    it = "carousel-item";
                }
                var li = $("<li></li>").attr("data-target", "#carousel-noticias").attr("data-slide-to", index).attr("class", c);
                $("#carousel-slide").append(li);
                var img = $("<img>").attr("class", "d-block w-100").attr("src", noticia.imagen);
                var hiper = $("<a></a>").attr("href", "/noticias/" + noticia._id).append(img);

                var div2 = $("<div></div>").attr("class", "carousel-caption d-none d-md-block").append($("<a></a>").text(noticia.titulo).attr("class", "titulo").attr("href", "/noticias/" + noticia._id).css("color", "white"));
                var div = $("<div></div>").attr("class", it).append(hiper).append(div2);
                $("#carousel-inn").append(div);
                
            } else {

                var img = $("<img>").attr("class", "card-img-top img-noticia-reducida").attr("src", noticia.imagen);
                var hiper = $("<a></a>").attr("href", "/noticias/" + noticia._id).append(img);
                var div2 = $("<div></div>").attr("class", "card-body").append($("<a></a>").text(noticia.titulo).attr("href", "/noticias/" + noticia._id).attr("class", "titulo card-title")).append($("<p></p>").text(noticia.sintesis).attr("class", "card-text mt-2"));
                var div = $("<div></div>").attr("class", "card text-justify").attr("id", "card-cuerpo").append(hiper).append(div2);
                $("#noticias-sec").append($("<div></div>").attr("class","col-sm-6").append(div));
            }
            cant++;
        }
        index++;
    });
}

function mostrarNoticia() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var index = url_string.lastIndexOf("/") + 1;
    var newsId = url_string.substr(index);
    
   $.get("/api/noticias", function(data, status) {


            $.each(data, function (i, not) {
                if (not._id === newsId) {
                    mostrarNoticiaCompleta(not);
                    return false;
                }
            });
     });
}

function mostrarNoticiaCompleta(noticia) {
    var img = $("<img>").attr("class", "img-noticia mt-3 mb-3").attr("src", noticia.imagen);
    var titulo = $("<h3></h3>").attr("class", "titulo-noticia").text(noticia.titulo);
    var sint = $("<h4></h4>").attr("class", "cuerpo-noticia").text(noticia.sintesis);
    var cuerpo = $("<p></p>").attr("class", "cuerpo-noticia").text(noticia.cuerpo);
    $("#noticia").append(img);
    $("#noticia").append(titulo);
    $("#noticia").append(sint);
    $("#noticia").append(cuerpo);
}


function mostrarCalendario(fechas) {

    var index;
    for (var fecha in fechas) {
        agregarDia(fecha);
        var partidosPorDia = fechas[fecha];
        for (index = 0; index < partidosPorDia.length; ++index) {
            agregarPartido(partidosPorDia[index]);
        }
    }
}

function mostrarCalendarioCompleto(data) {

    var pxJornada = data[jornadaActual - 1];
    $("#nroJornada").text("Jornada " + pxJornada.numero);
    mostrarJornadaEnTabla(pxJornada.partido);
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

                mostrarJornadaEnTabla(j.partido);
            }
           


     });

}


function mostrarJornadaEnTabla(partidos){


      $.get("/api/user_data", function(data, status) {

         for (index = 0; index < partidos.length; index++) {       
            if (!jQuery.isEmptyObject(data) && data.user.editor){
                if (partidos[index].editor === data.user.google.name){

                    var jornadaDeseada = partidos[index];

                    var row = $("<tr></tr>").attr("scope", "row").attr("data-toggle", "collapse").attr("data-target", "#accordion"+index).attr("class", "clickable");
                    row.append($("<td></td>").text(partidos[index].fecha));
                    row.append($("<td></td>").text(partidos[index].horario));
                    row.append($("<td></td>").text(partidos[index].equipo_local));

                    var row2 = $("<tr></tr>");
                    var local = $("<div></div>").attr("class", "col-lg-4").append("<label></label").attr("for", "local"+index).text("Local").append($("<input required>").attr("type", "number").attr("class", "form-control").attr("id", "local"+index));
                    var visita = $("<div></div>").attr("class", "col-lg-4").append("<label></label").attr("for", "visita"+index).text("Visita").append($("<input required>").attr("type", "number").attr("class", "form-control").attr("id", "visita"+index));
                    var selectOpcion =  $("<div></div>").attr("class", "col-lg-2").append($("<select></select>").attr("id", "opcion_atr"+index+"_"+1).attr("class", "form-control").append($("<option selected>Gol</option>")).append($("<option>Asistencia</option>")).append($("<option>Amarilla</option>")).append($("<option>Roja</option>")));
                    var selectJugador =  $("<div></div>").attr("class", "col-lg-4").append($("<select></select>").attr("id", "opcion_jugador"+index+"_"+1).attr("class", "form-control"));
                    var botonAgregar = $("<div></div>").append($("<button></button>").attr("onclick", "agregarOpcion('"+jornadaDeseada.equipo_local+"','"+jornadaDeseada.equipo_visitante+"',\"#form_editor"+index+"\","+index+","+1+")").attr("class", "btn btn-info btn-large").attr("id", "btnAgregar"+index+"_"+1).attr("type", "button").text("+"));
                    
                    var label = $("<div></div>").append($("<h4></h4>").attr("class", "mt-3").attr("id", "lbl_error_partido"+index).attr("style", "display: none"));
                    var botonAceptar = $("<div></div>").append($("<button></button>").attr("class", "btn btn-danger mt-2").attr("type", "submit").attr("onclick", "submitPartido('"+jornadaDeseada.equipo_local+"','"+jornadaDeseada.equipo_visitante+"',"+index+")").text("Aceptar"));

                    llenarSelect(jornadaDeseada.equipo_local, jornadaDeseada.equipo_visitante, index, 1);

                    var form2 = $("<div></div>").attr("id", "form2_editor"+index+"_"+1).attr("class", "form-row justify-content-center mt-3").append(selectOpcion).append(selectJugador).append(botonAgregar);
                    var form = $("<form></form>").attr("id", "form_editor"+index ).attr("class", "form-partido").attr("novalidate", true).append($("<div></div>").attr("class", "form-row justify-content-center").append(local).append(visita)).append(form2);
                    row2.append($("<td></td>").attr("colspan", 7).append($('<div></div>').attr("id", "accordion"+index).attr("class", "collapse").append(form).append(label).append(botonAceptar)));


                    var resultado = partidos[index].resultado;

                    
                    if (resultado === "vs")
                        row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text("vs")));
                    else{
                        var RL = resultado.substring(0, 1);
                        var RV = resultado.substring(1, 2);
                        row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text(RL + " - " + RV)));
                    }


                    row.append($("<td></td>").text(partidos[index].equipo_visitante));
                    row.append($("<td></td>").append($('<span></span>').attr("class", "oi oi-pencil")));
                    $("#tabla_fixture").append(row);
                    $("#tabla_fixture").append(row2);
                }
            }
            else{

                var row = $("<tr></tr>").attr("scope", "row");
                row.append($("<td></td>").text(partidos[index].fecha));
                row.append($("<td></td>").text(partidos[index].horario));
                row.append($("<td></td>").text(partidos[index].equipo_local));

                var resultado = partidos[index].resultado;

                
                if (resultado === "vs")
                    row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text("vs")));
                else{
                    var RL = resultado.substring(0, 1);
                    var RV = resultado.substring(1, 2);
                    row.append($("<td></td").append($("<span></span>").attr("class", "badge badge-pill badge-danger").text(RL + " - " + RV)));
                }

                row.append($("<td></td>").text(partidos[index].equipo_visitante));
                row.append($("<td></td>").attr("class", "tabla-estadio").text(partidos[index].estadio));
                row.append($("<td></td>").attr("class", "tabla-arbitro").text(partidos[index].arbitro));
                $("#tabla_fixture").append(row);

            }
            
        }
    });           
   
}

function agregarOpcion(local, visita, form, partido, i){
    
     $("#btnAgregar"+partido+"_"+i).text("x").attr("class", "btn btn-danger btn-large").attr("onclick", "descartarFila(" + partido +","+ i+ ")");
     i++;
     var selectOpcion =  $("<div></div>").attr("class", "col-lg-2").append($("<select></select>").attr("id", "opcion_atr"+partido+"_"+i).attr("class", "form-control").append($("<option selected>Gol</option>")).append($("<option>Asistencia</option>")).append($("<option>Amarilla</option>")).append($("<option>Roja</option>")));
     var selectJugador =  $("<div></div>").attr("class", "col-lg-4").append($("<select></select>").attr("id", "opcion_jugador"+partido+"_"+i).attr("class", "form-control"));
    
     llenarSelect(local, visita, partido, i);
     var botonAgregar = $("<div></div>").append($("<button></button>").attr("class", "btn btn-info btn-large").attr("id", "btnAgregar"+partido+"_"+i).attr("type", "button").attr("onclick","agregarOpcion('"+local+"','"+ visita + "',\"#form_editor"+partido+"\","+partido+","+i+")").text("+"));
     var form2 = $("<div></div>").attr("id", "form2_editor"+ partido+"_"+i).attr("class", "form-row justify-content-center mt-2").append(selectOpcion).append(selectJugador).append(botonAgregar);
     $(form).append(form2);

}

function llenarSelect(local, visitante, jornada, index){

    var t = false;

     $.get("/api/equipos", function(data, status) {
        $.each(data, function (i, equipo) {
            if (equipo.nombre_equipo === local ||  equipo.nombre_equipo === visitante){
                $.each(equipo.jugadores, function (i, jugador) {
                    var op = $("<option></option>").text(jugador.nombre_jugador);
                    $("#opcion_jugador"+jornada+"_"+index).append(op);
                });
                if (!t){
                    $("#opcion_jugador"+jornada+"_"+index).append($("<option></option>").text("------"));
                    t = true;
                }
            }       
        });
     }); 
}

function descartarFila(index, i){
    $("#form2_editor"+ index+ "_"+ i).remove();
}

function submitPartido(local, visitante, index){
    var res_local = $("#local"+index).val();
    var res_visita = $("#visita"+index).val();

    if (res_local === ""){
        $("#local"+index).effect("shake");
    }
    if (res_visita === ""){
        $("#visita"+index).effect("shake");
    }

    var resultado = res_local+""+res_visita;


    var goles = new Array();
    var asistencias = new Array();
    var amarillas = new Array();
    var rojas = new Array();

    var actual;
    var i = 1;
    var op = $("#form2_editor"+index+"_"+i);
    actual = $($(op.children()[0]).children()[0]).val();
    var cant = $($("#form_editor"+index)[0]).children().length;

    for(var j = 1; j < cant; j++) {
        actual = $($(op.children()[0]).children()[0]).val();
        if (actual === "Gol") goles.push($($(op.children()[1]).children()[0]).val());
        else if (actual === "Asistencia") asistencias.push($($(op.children()[1]).children()[0]).val());
        else if (actual === "Amarilla") amarillas.push($($(op.children()[1]).children()[0]).val());
        else if (actual === "Roja") rojas.push($($(op.children()[1]).children()[0]).val());
        i++;
        op = $("#form2_editor"+index+"_"+i);
    }


    if (goles.length !== (parseInt(res_local)+parseInt(res_visita))){
        $("#lbl_error_partido"+index).text("Cantidad de goles incorrecta");
        $("#lbl_error_partido"+index).show(); 
    }
    else{
     var data = {"goles_local": res_local, "goles_visita": res_visita, "local": local, "visitante": visitante, "jornada": jornadaActual, "fecha":index, "resultado": resultado, "goles": JSON.stringify(goles), "asistencias":  JSON.stringify(asistencias), "amarillas":  JSON.stringify(amarillas), "rojas":  JSON.stringify(rojas)};
     $.post('/admin/guardarResultado', data, function(resp) {      
         $("#lbl_error_partido"+index).text("Partido agregado");
         $("#lbl_error_partido"+index).show();         
      }); 
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

function ordenarEstadisticas(array, prop) {

    array.sort(
            function (a, b) {
                if (a[prop] < b[prop])
                    return 1;
                else
                    return -1;
            }
    );

}

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

function estadisticasPorEquipo() {

    $.get("/api/equipos", function(data, status) {
        $.each(data, function (i, equipo) {
                var n;

                if(equipo.partidos_jugados === 0)
                    n = 0;
                else
                    n = Math.round((equipo.goles_a_favor / equipo.partidos_jugados) * 100) / 100;

                equipo.promedio_gol = n;
            });

            ordenarEstadisticas(data, "goles_a_favor");
            mostrarMaximosEquipos(data, "goles_a_favor");
            ordenarEstadisticas(data, "goles_en_contra");
            mostrarMaximosEquipos(data, "goles_en_contra");
            ordenarEstadisticas(data, "promedio_gol");
            mostrarMaximosEquipos(data, "promedio_gol");
    });

}

function guardarFavorito(equipo){
    $.get("/api/user_data", function(data, status) {
        //Si no hay un usuario logueado, solo marca el favorito
       if (jQuery.isEmptyObject(data))
            marcarFavorito(equipo);
       else{
        //Si hay un usuario logueado, marca el favorito y lo guarda en la BD
        datos = {"equipo": equipo};
            $.post('/admin/guardarFavorito', datos, function(resp) {
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

function marcarFavorito(equipo){
    $('#tabla_posiciones > tbody  > tr' ).each(function() {
      if ($(this).children('td:nth-child(2)').text() === equipo)
        $(this).attr("class", "equipo_fav");
      else
        $(this).removeAttr("class");
    });
}

function eliminarFavorito(equipo){
    $('#tabla_posiciones > tbody  > tr' ).each(function() {
      if ($(this).children('td:nth-child(2)').text() === equipo)
        $(this).removeAttr("class");
    });
}
