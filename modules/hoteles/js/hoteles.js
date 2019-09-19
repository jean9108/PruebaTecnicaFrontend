var form_params = {};
var hotel = {};
var id = 0;

/*------ Acciones -------*/

//Crea nuevo hotel
$("body").on("click", "#crearHotel", async function(){
    await crearHotel();
});

if($("#hoteles").length){
    listarHoteles();
}

if($("#frmEditarHotel").length){
    id = $("#frmEditarHotel").data("id");
    verHotel(id);
}

if($("#frmCrearAsignacion").length){
    id = $("#frmCrearAsignacion").data("id");
    loadDataAsignacion(id);
}

$("body").on("click", "#editarHotel", async function(){
    await editarHotel(id);
});

$("body").on("change", "[name='id_habitacion']", async function(){
    let form = $("#frmCrearHotel");
    preloader(form);
    await loadAcomodacion($(this).val());
    removePreloader(form);
});

$("body").on("click", "#crearAsignacion", function(){
    crearAsignacion();
});

/*----- Funciones -----*/

async function crearHotel(){

    //Endpoint para ejecutar acción de crear y formulario a enviar
    let endpoint = "/hoteles/create";
    let form_id = "frmCrearHotel";
    let form = $("#"+form_id);

    //Parámetros para validar el formulario
    form_params = {
        form_id: form_id,
        endpoint: endpoint
    }

    preloader(form);

    //Valida y envia el formulario
    let has_errors = await validateForm(form_params);
    if(has_errors === false){
        printSuccess({
            element: form,
            alert_class: 'crearHotelAlert',
            alert_id: 'crearHotelSuccess',
            message: 'Registro exitoso'
        });
        form[0].reset();
    } else {
        printError({
            element: form,
            alert_class: 'crearHotelAlert',
            alert_id: 'crearHotelError',
            message: 'Tu formulario contiene errores'
        })
    }	

    //Remueve el precargador
    removePreloader(form);	
}

async function listarHoteles(){
    let endpoint = "/hoteles/index";
    let _hoteles = $("#hoteles");

    try{
        //Envía los datos a la API
        let res = await jsAjax({
            endpoint: endpoint,
            type: 'GET',
            json: null
        });

        let hotelesArr = res.hoteles;
        
        Object.keys(hotelesArr).forEach((key, index) => {

            let id_hotel = hotelesArr[index]['id_hotel'];
            let nombre = hotelesArr[index]['nombre'];
            let direccion = hotelesArr[index]['direccion'];
            let num_habitaciones = hotelesArr[index]['num_habitaciones'];

            $("#hoteles .loading").parent().remove();
            $("#hoteles .list").append(''+
                '<div class="card mt-3 mb-3">'+
                    '<div class="card-header d-flex justify-content-between"><span>'+nombre+'</span><a href="/hoteles/editar/'+id_hotel+'"><i class="far fa-edit"></i></a></div>'+
                    '<div class="card-body">'+
                        '<h5 class="card-title">'+direccion+'</h5>'+
                        '<p class="card-text"><b>Habitaciones:</b> <span>'+num_habitaciones+'</span></p>'+
                        '<a class ="btn btn-success"href="/hoteles/asignacion/'+id_hotel+'">Crear asignación</a>'+
                    '</div>'+
                '</div>'+
            '');
        })

    } catch(error){
        //Recoge error si hay algun fallo en la API o conexión
        printError({
            element: _hoteles,
            alert_class: 'crearHotelAlert',
            alert_id: 'crearHotelError',
            message: 'Error'
        })
    }
}

async function verHotel(id){
    let endpoint = "/hoteles/view?id="+id;
    let form_id = "frmEditarHotel";
    let form = $("#"+form_id);

    preloader(form);

    try{
        //Envía los datos a la API
        let res = await jsAjax({
            endpoint: endpoint,
            type: 'GET',
            json: null
        });

        hotel = res.hotel;
        fillFormWithJSON(hotel);

    } catch(error){
        //Recoge error si hay algun fallo en la API o conexión
        printError({
            element: form,
            alert_class: 'editarHotelAlert',
            alert_id: 'editarHotelError',
            message: 'Falló al cargar la información'
        })
    }

    removePreloader(form);
}

async function editarHotel(id){
    //Endpoint para ejecutar acción de crear y formulario a enviar
    let endpoint = "/hoteles/update?id="+id;
    let form_id = "frmEditarHotel";
    let form = $("#"+form_id);

    //Parámetros para validar el formulario
    form_params = {
        form_id: form_id,
        endpoint: endpoint
    }

    //Valida y envia el formulario
    let has_errors = await validateForm(form_params);	
    preloader(form);

    if(has_errors === false){           
        printSuccess({
            element: form,
            alert_class: 'simpleAlert',
            alert_id: 'editarHotelSuccess',
            message: 'Actualización exitosa'
        });        
    } else {
        printError({
            element: form,
            alert_class: 'simpleAlert',
            alert_id: 'editarHotelError',
            message: 'Tu formulario contiene errores'
        })
    }

    //Remueve el precargador
    removePreloader(form);	
}

async function loadDataAsignacion(){
    let form = $("#frmCrearAsignacion");
    preloader(form);
    await verHotel(id);
    $("#numHabitaciones").text(hotel.num_habitaciones);
    await loadHabitaciones();
    await loadHabitacionesDisponibles();
    removePreloader(form);
}

async function loadHabitaciones(){
    let endpoint = "/habitacion/index";
    let form = $("#frmCrearAsignacion");

    try{
        let res = await jsAjax({
            endpoint: endpoint,
            type: 'GET',
            json: null
        });

        let habitaciones = res.habitaciones;

        for(key in habitaciones)
        {
            if(habitaciones.hasOwnProperty(key)){
                $('[name="id_habitacion"]').append(''+
                    '<option value="'+key+'">'+habitaciones[key]+'</option>'+
                '');
            }
        }

    } catch(error){
        //Recoge error si hay algun fallo en la API o conexión
        printError({
            element: form,
            alert_class: 'simpleAlert',
            alert_id: 'editarHotelError',
            message: 'Falló al cargar la información'
        })
    }
}

async function loadAcomodacion(id_habitacion){
    let endpoint = "/habitacion/view?id="+id_habitacion;
    let form = $("#frmCrearAsignacion");

    $('[name="id_acomodacion"]').html(''+
        '<option value="">Seleccionar</option>'+
    '');

    if(!id_habitacion){
        $('[name="id_acomodacion"]').attr('disabled', true);
        return;
    }

    try{
        let res = await jsAjax({
            endpoint: endpoint,
            type: 'GET',
            json: null
        });

        let acomodaciones = res.acomodaciones;

        for(key in acomodaciones)
        {
            if(acomodaciones.hasOwnProperty(key)){
                $('[name="id_acomodacion"]').append(''+
                    '<option value="'+key+'">'+acomodaciones[key]+'</option>'+
                '');
            }
        }

        $('[name="id_acomodacion"]').attr('disabled', false);

    } catch(error){
        //Recoge error si hay algun fallo en la API o conexión
        printError({
            element: form,
            alert_class: 'simpleAlert',
            alert_id: 'editarHotelError',
            message: 'Falló al cargar la información'
        })
    }
}

async function loadHabitacionesDisponibles(){
    let endpoint = "/habitacion/habitacionesdisponibles?id="+id;
    let form = $("#frmCrearAsignacion");

    try{
        //Envía los datos a la API
        res = await jsAjax({
            endpoint: endpoint,
            type: 'GET',
            json: null
        });

        $("#numHabitacionesDisponibles").text(res.cantidad);

    } catch(error){
        //Recoge error si hay algun fallo en la API o conexión
        printError({
            element: form,
            alert_class: 'simpleAlert',
            alert_id: 'crearHabitacionError',
            message: error
        })
    }
}

async function crearAsignacion(){
    //Endpoint para ejecutar acción de crear y formulario a enviar
    let endpoint = "/habitacion/create?id="+id;
    let form_id = "frmCrearAsignacion";
    let form = $("#"+form_id);

    //Parámetros para validar el formulario
    form_params = {
        form_id: form_id,
        endpoint: endpoint
    }

    //Valida y envia el formulario
    let has_errors = await validateForm(form_params);
    console.log(has_errors);
    
    //Crea precargador
    preloader(form);

    if(has_errors === false){   
        printSuccess({
            element: form,
            alert_class: 'simpleAlert',
            alert_id: 'crearAsignacionSuccess',
            message: 'Registro exitoso'
        });

        form[0].reset();
        await loadHabitacionesDisponibles();
    } else {
        printError({
            element: form,
            alert_class: 'simpleAlert',
            alert_id: 'crearHabitacionError',
            message: 'Tu formulario contiene errores'
        })
    }

    //Remueve el precargador
    removePreloader(form);
}

