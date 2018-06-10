
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