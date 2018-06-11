
//Muestra las noticias en el index.
function abrirNoticias() {

    $.get("/api/noticias", function(data, status) {
        mostrarNoticiasReducidas(data);     
    });
}

//Muestra las noticias en el apartado del editor.
function abrirNoticiasEditor() {

    $.get("/api/noticias", function(data, status) {
        mostrarNoticiasReducidasEditor(data);     
    });
}


//Muestra uan noticia completa.
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


//Auxiliar del anterior.
function mostrarNoticiaCompleta(noticia) {
    var img = $("<img>").attr("class", "img-noticia mt-3 mb-3").attr("src", noticia.imagen);
    var titulo = $("<h3></h3>").attr("class", "titulo-noticia").text(noticia.titulo);
    var sint = $("<h4></h4>").attr("class", "cuerpo-noticia").text(noticia.sintesis);
    var cuerpo = $("<p></p>").attr("class", "cuerpo-noticia").text(noticia.cuerpo);

    $("#noticia").append(img);
    $("#noticia").append(titulo);
    $("#noticia").append(sint);
    $("#noticia").append(cuerpo);

    if(chequearVideo(noticia.video)){

        var url = noticia.video.substring(0, 24)+"embed/"+ noticia.video.substring(32);

        var vd = $("<iframe></iframe>").attr("id", "player").attr("type", "text/html").attr("width", "100%"). attr("height", "60%").attr("src", url);

        $("#noticia").append(vd);

    }
}


//Muestra las noticias en forma reducida.
function mostrarNoticiasReducidas(noticias) {
    var index = 0;
    var cant = 0;
    var principales = 0;
    $.each(noticias, function (i, noticia) {
        if(cant < 6 && noticia.seleccionada){
            if (noticia.categoria === "principal") {
                principales++;
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

                var div2 = $("<div></div>").attr("class", "carousel-caption d-none d-md-block").append($("<a></a>").text(noticia.titulo).attr("class", "titulo-index").attr("href", "/noticias/" + noticia._id).css("color", "white"));
                var div = $("<div></div>").attr("class", it).append(hiper).append(div2);
                $("#carousel-inn").append(div);
                index++;
            } else {

                var img = $("<img>").attr("class", "card-img-top img-noticia-reducida").attr("src", noticia.imagen);
                var hiper = $("<a></a>").attr("href", "/noticias/" + noticia._id).append(img);
                var div2 = $("<div></div>").attr("class", "card-body").append($("<a></a>").text(noticia.titulo).attr("href", "/noticias/" + noticia._id).attr("class", "titulo-index card-title")).append($("<p></p>").text(noticia.sintesis).attr("class", "card-text mt-2"));
                var div = $("<div></div>").attr("class", "card text-justify").attr("id", "card-cuerpo").append(hiper).append(div2);
                $("#noticias-sec").append($("<div></div>").attr("class","col-sm-6").append(div));
            }
            cant++;

        }
    });

    if (principales === 0){
        $('#carousel-index').remove();
    }
}

//Muestra las noticias reducidar al editor en el carousel.
function mostrarNoticiasReducidasEditor(noticias) {

    var index = 0;
    var cant = 0;
    $.each(noticias, function (i, noticia) {
        if(noticia.seleccionada){
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
            var img = $("<img>").attr("class", "imagen-noticia d-block w-100").attr("src", noticia.imagen);
            var hiper = $("<a></a>").attr("href", "/noticias/" + noticia._id).append(img);

            var div2 = $("<div></div>").attr("class", "carousel-caption d-none d-md-block").append($("<a></a>").text(noticia.titulo).attr("class", "titulo").attr("href", "/noticias/" + noticia._id).css("color", "white"));
            var div = $("<div></div>").attr("class", it).append(hiper).append(div2);
            $("#carousel-inn").append(div);     
            index++;       
        }
    });
}


//Guarda una nueva noticia ingresada por el editor.
function guardarNoticia(){

    var titulo = $("#titulo_noticia").val();
    var sintesis = $("#sintesis_noticia").val();
    var cuerpo = $("#cuerpo_noticia").val();
    var categoria = $("#categoria_noticia").val();

    var video = $("#video_noticia").val();

    var imagen = $("#img_noticia").val();

    var filename = imagen.substring(imagen.lastIndexOf('\\')+1);


    var fecha = new Date();
    var dd = ("0" + fecha.getDate()).slice(-2);
    var mm = ("0" + (fecha.getMonth()+1)).slice(-2)
    var yyyy = fecha.getFullYear();

    fecha = dd + '/' + mm + '/' + yyyy;    

    var datos = {"titulo": titulo, "sintesis": sintesis, "cuerpo": cuerpo, "categoria" : categoria, "video": video, "fecha": fecha, "file": imagen[0]}; 

    $.post('nuevaNoticia', datos, function(resp) {
        if (resp === "Exito"){
        }            
    });

}


//Chequea que el link del video sea correcto.
function chequearVideo(dir){

    if(dir === undefined)
        return false;

    if(dir.indexOf("https://www.youtube.com/watch?") < 0){
        return false;
    }

    return true;
}

//Código para validar campos al ingresar una noticia
(function() {
    'use strict';
    window.addEventListener('load', function() {
        var forms = document.getElementsByClassName('form-noticia');
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
