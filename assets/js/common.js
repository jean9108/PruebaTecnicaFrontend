/*----- Endpoint API Rest -----*/
var endpoint = 'http://192.168.0.12/gestor_hoteles/web/index.php';

/*----- Validación de formularios del lado del servidor -----*/
async function validateForm(params){

    var validation_params = {
      error_type: 'tooltip',
      ajax_validation: true,
      endpoint: endpoint+params.endpoint,
    };

    if(params.form_unique_class==undefined){
      validation_params['form_id'] = params.form_id;
    } else {
      validation_params['form_unique_class'] = params.form_unique_class;
    }

    if(params.error_type!=undefined)
    validation_params['error_type'] = params.error_type;

    var frm_sc = new FormValidator(validation_params);

    return await frm_sc.validateFormFields();
}

/*----- Formulario a JSON -----*/
function formToJSON(form){
    var form_array = form.serializeArray();
    var form_JSON = {}
    $(form_array).each(function(index, obj){
        form_JSON[obj.name] = obj.value;
    });
    return form_JSON;
}

/*----- Preloader ------*/
function preloader(element){
  element.append(''+
    '<div style="left: 0px; top: 0px; right: 0px; bottom: 0px;" class="position-absolute preloader d-flex justify-content-center align-items-center">'+
      '<img src="/assets/images/loading.svg">'+
    '</div>'+
  '');
}

function removePreloader(element){
  element.find('.preloader').remove();
}

/*------ Envio de datos -------*/
function jsAjax(params){

  let json = JSON.stringify(params.json);

  return new Promise((resolve, reject) => {
    $.ajax({
      url: endpoint+params.endpoint,
      type: params.type,
      data: {json: json},
      success: function(response){
        resolve(response);
      },
      error: function(jqXHR, textStatus, errorThrown){
        if(jqXHR.status === 0){
          reject('Not connect: Verify Network.');
        } else if(jqXHR.status == 404){
          reject('Requested page not found [404]');
        } else if(jqXHR.status == 500){
          reject('Internal Server Error [500].');
        } else if(textStatus === 'parsererror'){
          reject('Requested JSON parse failed.');
        } else if (textStatus === 'timeout'){
          reject('Time out error.');
        } else if (textStatus === 'abort'){
          reject('Ajax request aborted.');
        } else {
          reject('Uncaught Error: ' + jqXHR.responseText);
        }
      }
    });
  });
}

/*------ Alertas -------*/
function printSuccess(args){
  $("."+args.alert_class).remove();
  $("#"+args.alert_id).remove();
  args.element.after(''+
    '<div id="'+args.alert_id+'" class="alert alert-success '+args.alert_class+'">'+args.message+
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
        '<span aria-hidden="true">&times;</span>'+
      '</button>'+
    '</div>'+
  '');
}

function printError(args){
  $("."+args.alert_class).remove();
  $("#"+args.alert_id).remove();
  args.element.after(''+
    '<div id="'+args.alert_id+'" class="alert alert-danger '+args.alert_class+'">'+
      args.message+
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
        '<span aria-hidden="true">&times;</span>'+
      '</button>'+
    '</div>'+
  '');
}

function fillFormWithJSON(json){
  for(key in json)
  {
    if(json.hasOwnProperty(key))
      $('[name='+key+']').val(json[key]);
  }
}