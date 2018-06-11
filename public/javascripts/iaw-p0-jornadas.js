
var vistaEditor = true;

function abrirJornadas() {

	$.get("/api/fechas", function(data, status) {

		mostrarCalendarioCompleto(data);
	});

}

function abrirJornadaIndex() {

	$.get("/api/fechas", function(data, status) {
		if (data.length > 0)
			mostrarCalendario(ordenarJornadas(data));
		else{
			var row = $("<tr></tr>").attr("scope", "row").append($("<td></td>").text("No se ha generado el fixture").attr("colspan", "8").css("font-size",  "20px"));
      		$("#calendario").append(row);
      		$("#num-jornada").text("Calendario ");
      		$("#btn_calendario_completo").hide();
		}
	});

}


//Muestra el calendario. 
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


//Muestra el calendario completo.
function mostrarCalendarioCompleto(data) {

	if (data.length === 0){
		var row = $("<tr></tr>").attr("scope", "row").append($("<td></td>").text("No se ha generado el fixture").attr("colspan", "8").css("font-size",  "20px"));
      	$("#tabla_fixture").append(row);
      	$("#btn_jornada_anterior").css('visibility', 'hidden');
      	$("#btn_jornada_siguiente").css('visibility', 'hidden');
	}

	else{

		  var pxJornada;
		  $.get("/api/fechas", function(data, status) {

		    $.each(data, function (i, jornada) {
		      if (jornada.numero === jornadaActual) {
		        pxJornada = jornada;
		      }
		    });

		    if(pxJornada !== undefined){
		        $("#nroJornada").text("Jornada " + pxJornada.numero);
		        mostrarJornadaEnTabla(pxJornada.partidos);

		        if(jornadaActual === 1)
					$("#btn_jornada_anterior").css("visibility", "hidden");
		    }

		  });	
	}
}

function agregarDia(fecha) {
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

//Obtiene una jornada con un dado número. Para la jornada siguiente y anterior.

function obtenerJornada(nro) {
	var j;

	$.get("/api/fechas", function(data, status) {

		var total = data.length;

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
			
			if (nro === total)
				$("#btn_jornada_siguiente").css("visibility", "hidden");
			else
				$("#btn_jornada_siguiente").css("visibility", "visible");

			mostrarJornadaEnTabla(j.partidos);
		}



	});

}

//Muestra el calendario para un usuario no editor.
function mostrarJornadaUsuario(partidos){


	for (index = 0; index < partidos.length; index++) {

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
		$("#tabla_fixture").append(row);
	}

}

//Muestra el calendario para un usuario editor.
function mostrarJornadaEditor(partidos, index){

	var jornadaDeseada = partidos[index];

	var row = $("<tr></tr>").attr("scope", "row").attr("data-toggle", "collapse").attr("data-target", "#accordion"+index).attr("class", "clickable").attr("id", "partido"+index);
	row.append($("<td></td>").text(partidos[index].fecha));
	row.append($("<td></td>").text(partidos[index].horario));
	row.append($("<td></td>").text(partidos[index].equipo_local));

	var row2 = $("<tr></tr>");
	var local = $("<div></div>").append("<label></label").attr("for", "local"+index).text("Local").append($("<input required>").attr("type", "number").attr("class", "form-control").attr("id", "local"+index));
	var visita = $("<div></div>").append("<label></label").attr("for", "visita"+index).text("Visita").append($("<input required>").attr("type", "number").attr("class", "form-control").attr("id", "visita"+index));
	var selectOpcion =  $("<div></div>").attr("class", "col-sm-2").append($("<select></select>").attr("id", "opcion_atr"+index+"_"+1).attr("class", "form-control").append($("<option selected>Gol</option>")).append($("<option>Asistencia</option>")).append($("<option>Amarilla</option>")).append($("<option>Roja</option>")));
	var selectJugador =  $("<div></div>").attr("class", "col-sm-4").append($("<select></select>").attr("id", "opcion_jugador"+index+"_"+1).attr("class", "form-control"));
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
	row.append($("<td></td>").append($('<span></span>').attr("class", "oi oi-pencil").attr("id", "edit"+ index)));
	$("#tabla_fixture").append(row);
	$("#tabla_fixture").append(row2);

}


//Muestra una jornada, para un usuario o un editor segun corresponda.
function mostrarJornadaEnTabla(partidos){
	$("#tabla_fixture").empty();
	$.get("/api/user_data", function(data, status){
		if (!jQuery.isEmptyObject(data) && data.user.editor){
			if(vistaEditor){
				var cont= 0;
				$("#th-editar").text("Editar");
				for(index = 0; index < partidos.length; index++){
					if(partidos[index].editor === data.user.google.name){
						mostrarJornadaEditor(partidos, index);
						cont++;
					}
				}
				if(cont === 0){
					mostrarMensajeEditor();
				}

			}
			else{
				$("#th-editar").text("Estadio");
				mostrarJornadaUsuario(partidos);
			}
		}
		else{
			$("#th-editar").text("Estadio");
			mostrarJornadaUsuario(partidos);
		}
	});
}

//Mensaje para los partidos asignados a un editor, cuando no tiene ninguno en una jornada.
function mostrarMensajeEditor(){

	var row = $("<tr></tr>").attr("scope", "row");
	row.append($("<td></td>").text("No hay partidos asignados en esta jornada.").attr("colspan", "6"));
	$("#tabla_fixture").append(row);
}


//Obtiene la jornada anterior o siguiente, según se haya elegido.
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

//Guardar cambios del editor sobre un partido
function agregarOpcion(local, visita, form, partido, i){

	$("#btnAgregar"+partido+"_"+i).text("x").attr("class", "btn btn-danger btn-large").attr("onclick", "descartarFila(" + partido +","+ i+ ")");
	i++;
	var selectOpcion =  $("<div></div>").attr("class", "col-sm-2").append($("<select></select>").attr("id", "opcion_atr"+partido+"_"+i).attr("class", "form-control").append($("<option selected>Gol</option>")).append($("<option>Asistencia</option>")).append($("<option>Amarilla</option>")).append($("<option>Roja</option>")));
	var selectJugador =  $("<div></div>").attr("class", "col-sm-4").append($("<select></select>").attr("id", "opcion_jugador"+partido+"_"+i).attr("class", "form-control"));

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


//Guarda los cambios hechos por el editor sobre un partido.
//Realiza los chequeos correspondientes sobre cantidad de goles y asistencias, autores de los goles y asistencias, y que coincidan con el resultado ingresado.
//Si está todo bien, guarda y quita ese partido de los asignados al editor.
function submitPartido(local, visitante, index){

	$.get("/api/equipos", function(data, status) {

		var jugadoresLocal, jugadoresVisitante;
		$.each(data, function (i, equipo) {

			if(equipo.nombre_equipo === local)
				jugadoresLocal = equipo.jugadores;

			if(equipo.nombre_equipo === visitante)
				jugadoresVisitante = equipo.jugadores;

		});

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
		var golesLocal = new Array();
		var golesVisita = new Array();

		var asistencias = new Array();
		var asistenciaLocal = new Array();
		var asistenciaVisita = new Array();

		var amarillas = new Array();
		var rojas = new Array();

		var actual;
		var i = 1;
		var op = $("#form2_editor"+index+"_"+i);
		actual = $($(op.children()[0]).children()[0]).val();
		var cant = $($("#form_editor"+index)[0]).children().length;

		var encontreJug = false;

		for(var j = 1; j < cant; j++) {
			actual = $($(op.children()[0]).children()[0]).val();

			if (actual === "Gol"){
				var nombre = $($(op.children()[1]).children()[0]).val();
				goles.push(nombre);
				$.each(jugadoresLocal, function (i, jugador) {

					if(jugador.nombre_jugador === nombre){
						golesLocal.push(nombre);
						encontreJug = true;
					}

				});

				if(!encontreJug){
					$.each(jugadoresVisitante, function (i, jugador) {

						if(jugador.nombre_jugador === nombre){
							golesVisita.push(nombre);
						}

					});
				}

				encontreJug = false;

			}
			else if (actual === "Asistencia") {
				var nombre = $($(op.children()[1]).children()[0]).val()
				asistencias.push(nombre);

				$.each(jugadoresLocal, function (i, jugador) {

					if(jugador.nombre_jugador === nombre){
						asistenciaLocal.push(nombre);
						encontreJug = true;
					}

				});

				if(!encontreJug){
					$.each(jugadoresVisitante, function (i, jugador) {

						if(jugador.nombre_jugador === nombre){
							asistenciaVisita.push(nombre);
						}

					});
				}

				encontreJug = false;

			}
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
			if(asistencias.length > goles.length){
				$("#lbl_error_partido"+index).text("Cantidad de asistencias incorrecta");
				$("#lbl_error_partido"+index).show();
			}
			else{
				if((golesLocal.length > res_local)||(golesVisita.length > res_visita)){
					$("#lbl_error_partido"+index).text("Cantidad de goles incorrecta");
					$("#lbl_error_partido"+index).show();
				}
				else{
					if((asistenciaLocal.length > res_local)||(asistenciaVisita.length > res_visita)){
						$("#lbl_error_partido"+index).text("Cantidad de asistencias incorrecta");
						$("#lbl_error_partido"+index).show(); 
					}
					else{

						var data = {"goles_local": res_local, "goles_visita": res_visita, "local": local, "visitante": visitante, "jornada": jornadaActual, "fecha": (((jornadaActual-1)*10)+index), "resultado": resultado, "goles": JSON.stringify(goles), "asistencias":  JSON.stringify(asistencias), "amarillas":  JSON.stringify(amarillas), "rojas":  JSON.stringify(rojas)};
						$.post('guardarResultado', data, function(resp) {      
							$("#lbl_error_partido"+index).text("Partido agregado");
							$("#lbl_error_partido"+index).show(); 
							toastr.success("Partido editado");
							$("#accordion"+index).parent().parent().remove();
							$("#partido"+index).remove();
							var tbody = $("#tabla_fixture")[0];
							if (tbody.children.length == 0){                              
								var row = $("<tr></tr>").attr("scope", "row");
								row.append($("<td></td>").text("No hay partidos asignados en esta jornada.").attr("colspan", "6"));
								$("#tabla_fixture").append(row);
							}                            
						}); 
					}   
				}
			}
		} 
	});
}


//Ordenar
function ordenarJornadas(data) {

	var jornadas = new Array();

	$.each(data, function (i, obj) {
		jornadas[jornadas.length] = obj;
	});

	var index;
	var j = new Object(); 
	var jActual = jornadas[jornadaActual - 1].partidos;
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


//En modo editor, pasa de una vista de editor a usuario o viceversa.
function cambiarVista(){

    if($("#checkslider")[0].checked){
        vistaEditor = true;
        $("#calendar").text("Mis Partidos");
    }
    else{
        vistaEditor = false;
        $("#calendar").text("Calendario");
    }

    $.get("/api/fechas", function(data, status) {
        if (data.length > 0)
            mostrarCalendarioCompleto(data);
    });

}
