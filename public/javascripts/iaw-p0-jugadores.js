

//Muestra los jugadores de un equipo.
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

//Muestra los jugadores en la interface. Auxiliar al anterior.

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