var jornadaDeseada;
var jornadaActual = 1;

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
               $.post("cambiarEstilo", {"estilo": 1})
            }
            //Ningun usuario inicio sesión
            else{
                $('#estilo').attr('href', '/stylesheets/iaw-p0.css');
                $.post("cambiarEstilo", {"estilo": 0})
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
