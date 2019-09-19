class FormValidator{

	constructor(params){
		this.frm_id = (params.form_unique_class==undefined) ? '#'+params.form_id : '.'+params.form_unique_class;
		this.language = params.form_lang;
		this.field_error_type = params.error_type;
		
		//Validación ajax desde el backend
		this.ajax_validation = params.ajax_validation;
		this.endpoint = params.endpoint;		
	}

	async validateFormFields(frm_fields){

		this.hasErrors = false;		
		this.stop_loop = false;
		this.stored_errors = {}

		//------------- Validación AJAX -------------//
		if(this.ajax_validation==true){
			rules = ['ajaxValidation'];
			await this.proccessRules(rules);			
			return this.hasErrors;			
		}
		//----------- Fin Validación AJAX -----------//

		this.frm_fields = Object.keys(frm_fields);
		this.num_fields = this.frm_fields.length;			

		var counter = 1;

		for(var frm_field of this.frm_fields){
			this.custom_error_message = false;
			this.frm_field = frm_field;
			this.field_data = frm_fields[frm_field]
			this.field_label = this.field_data.field_label;
			this.async_functions = (this.field_data.async_functions!=undefined) ? this.field_data.async_functions : '';				

			var rules = this.field_data.field_rules;
			
			if((this.field_data.custom_error!=undefined)){

			this.field_error_type = (this.field_data.custom_error.error_type!=undefined) ? this.field_data.custom_error.error_type : 'placeholder';
			this.field_error_class = (this.field_data.custom_error.error_class!=undefined) ? this.field_data.custom_error.error_class : 'error_class';

			} else {
				this.field_error_type = 'placeholder';
				this.field_error_class = 'error_class';
			}

			if(this.field_data.required)
			rules = 'required|'+rules;				
	    	
	    	rules = (!rules.match(/\|/)) ? [rules] : rules.split('|');		    	

	    	this.field = $('[name='+this.frm_field+']');

	    	if(this.field_data.custom_error!=undefined)
	    	this.field_error_type = this.field_data.custom_error.error_type;

	    	if(this.field.val() && !this.field_data.required){	    		
	    		await this.proccessRules(rules);
	    	} else if(this.field_data.required){
	    		await this.proccessRules(rules);
	    	}	    	    	
	    	counter++;    	
		}		

		this.printErrors();
		this.generateTooltips();
		this.activateCleanErrorOnFocus();				

		return this.hasErrors;

	}

	//---Procesamiento reglas de validación---//

	async proccessRules(rules){
		this.stop_loop_rule = false;		
		
		for(var rule of rules){			
			if(!this.stop_loop_rule){	
				if(rule.match(/:/)){				
					var rule_data = rule.split(':');
					var rule_name = rule_data[0];
					var rule_value = rule_data[1];
					await this.executeRule(rule_name, rule_value);					
				} else {
					await this.executeRule(rule);
				}
			}
		};
		
	}

	//---Ejecución reglas de validación---//

	async executeRule(rule, rule_value){

		this.rule = rule;
		this.rule_value = rule_value;

		if(this.ajax_validation!=true)
		this.field_value = this.field.val();

		rule_value = (rule_value!=undefined) ? rule_value : '';

		switch(rule){
			case 'required':
				this.required();
			break;

			case 'text':
				this.checkIstext();
			break;

			case 'minLength':
				this.minLength(rule_value);
			break;

			case 'colCelNumber':
			break;

			case 'url':
				this.url();
			break

			case 'email':
				this.email();
			break

			case 'phone':
				this.phone();
			break

			case 'cel':
				this.cel();
			break

			case 'number':
				this.number();
			break

			case 'check':
				this.check(rule_value);
			break

			case 'asyncFunction':
				await this.executeAsyncFunction(rule_value);
			break;

			case 'ajaxValidation':
				await this.executeAjaxValidation();
			break;

			default:
			//
		}

	}

	//------------ Validation rules --------------//

	required(){
		if(this.field_value == 0 || !this.field_value)
		this.storeError();		
	}

	minLength(min_length){		
		if(this.field_value.length < min_length)
		this.storeError();
	}

	url(){
		var pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
		
		if(!pattern.test(this.field_value))
		this.storeError();
	}

	checkIstext(){
		if(!isNaN(parseInt(this.field_value)) && this.field_value)
		this.storeError();
	}

	email(){
		var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	if(!pattern.test(String(this.field_value).toLowerCase()))
    	this.storeError();
	}

	phone(){
		var pattern = /[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

		if(!pattern.test(String(this.field_value)))
		this.storeError();
	}

	cel(){
		var pattern = /^\d{10}$/;

		if(!pattern.test(String(this.field_value)))
		this.storeError();
	}

	number(){
		var pattern = /^\d+$/;

		if(!pattern.test(String(this.field_value)))
		this.storeError();
	}

	check(bool_value){
		if(bool_value){
			if(!this.field.is(':checked'))
			this.storeError();
		} else {
			if(this.field.is(':checked'))
			this.storeError();
		}
	}

	async executeAsyncFunction(rule_value){
		var response = await this.async_functions[rule_value]();		
		response = (response) ? JSON.parse(response) : '';
		if(response && response.error){					
			this.custom_error_message = response.error;
			this.storeError();
		}		
	}

	async executeAjaxValidation(){
        var data = this.formToJSON($(this.frm_id));
        data = JSON.stringify(data);
        
		var promise = new Promise((resolve, reject) => {
	        $.ajax({
	            type: 'POST',
	            url: this.endpoint,
	            data: {json: data},
	            success: (respuesta) => {	
	            	console.log('ajax_validation:', respuesta);
	                resolve(respuesta);
	            }
	        });
	    });				

		var response = await promise;
		
		if(response.status == 'error'){
			this.hasErrors = true;
			return;
		}

        var errors = response.errors; 

        if(errors != undefined){
            this.frm_fields = Object.keys(errors);
            for(var frm_field of this.frm_fields){
                if(errors[frm_field]!=undefined){
                    this.field = $('[name='+frm_field+']');
                    this.custom_error_message = errors[frm_field][0];
                    this.printError();
                }
                if(this.field_error_type == 'alert' || this.field_error_type == 'windowAlert')
                break;
            }
        }
	    
	    this.generateTooltips();
	    this.activateCleanErrorOnFocus();   
	}

	storeError(){	

		if(this.stored_errors[this.frm_field]==undefined)							this.stored_errors[this.frm_field] = {};

		if(this.stored_errors[this.frm_field]['dom_field']==undefined) 				this.stored_errors[this.frm_field]['dom_field'] = this.field;
		if(this.stored_errors[this.frm_field]['field_label']==undefined) 			this.stored_errors[this.frm_field]['field_label'] = this.field_label;
		if(this.stored_errors[this.frm_field]['field_error_class']==undefined) 		this.stored_errors[this.frm_field]['field_error_class'] = this.field_error_class;
		if(this.stored_errors[this.frm_field]['field_error_type']==undefined) 		this.stored_errors[this.frm_field]['field_error_type'] = this.field_error_type;
		if(this.stored_errors[this.frm_field]['custom_error_message']==undefined) 	this.stored_errors[this.frm_field]['custom_error_message'] = this.custom_error_message;
		if(this.stored_errors[this.frm_field]['language']==undefined) 				this.stored_errors[this.frm_field]['language'] = this.language;
		if(this.stored_errors[this.frm_field]['rule']==undefined) 					this.stored_errors[this.frm_field]['rule'] = this.rule;

		if(this.field_error_type == 'alert' || this.field_error_type == 'windowAlert')
		this.stop_loop = true;

	}

	printErrors(){	
		var stored_errors_fields = Object.keys(this.stored_errors);
		for(var frm_field of stored_errors_fields){			
			this.field = this.stored_errors[frm_field]['dom_field'];
			this.field_label = this.stored_errors[frm_field]['field_label'];
			this.field_error_class = this.stored_errors[frm_field]['field_error_class'];
			this.field_error_type = this.stored_errors[frm_field]['field_error_type'];
			this.custom_error_message = this.stored_errors[frm_field]['custom_error_message'];
			this.language = this.stored_errors[frm_field]['language'];
			this.rule = this.stored_errors[frm_field]['rule'];
			this.printError();

			if(this.stop_loop){
				break;
			}
		}
	}	
	
	printError(){		
		this.hasErrors = true;		
		this.field.addClass(this.field_error_class);		

		this.stop_loop_rule;

		var errors = {
			alert: () => this.alertErrors(),
			placeholder: () => this.placeholderErrors(),
			tooltip: () => this.tooltipErrors(),
			windowAlert: () => this.windowAlertErrors(),
		};

		errors[this.field_error_type]();

	}

	placeholderErrors(){
		this.field.addClass('placeholder_val');

		if(this.field.attr('data-original-ph')==undefined)
		this.field.attr('data-original-ph', this.field.attr('placeholder'));

		this.field.attr('placeholder', this.errorMessage());				
	}

	tooltipErrors(){
		this.field.addClass('tooltip_background tooltip_error');	
		var parent_of_field = this.field.parent();
		var is_outer_tooltip = false;

		if(parent_of_field.hasClass('outer_tooltip')){
			parent_of_field = parent_of_field.parent();
			is_outer_tooltip = true;		 
		}

		if(!parent_of_field.find(".tooltip_alert").length){
			var tooltip = '<div data-ot="'+this.errorMessage()+'" data-ot-delay="2" class="tooltip_alert"></div>';
			if(!is_outer_tooltip){
				this.field.after(tooltip);	
			} else {
				parent_of_field.addClass('tooltip_offset');
				parent_of_field.append(tooltip);				
			}
		}
	}

	alertErrors(){
		this.field.addClass('alert_val');
		alert(this.errorMessage());
	}

	windowAlertErrors(){
		//Requiere función para generar ventanas modales
		this.field.addClass('alert_val');
		modal_window = new ModalWindow({
          title: "Error",
          message: this.errorMessage()          
        });
	}

	errorMessage(){

		if(this.custom_error_message)
		return this.custom_error_message;

		var error_messages = {
			es : {
				required: 'El campo '+this.field_label+' es obligatorio',
				minLength: 'El valor introducido en '+this.field_label+' es muy corto',
				text: 'El campo '+this.field_label+' no puede ser un valor numérico',				
				url: 'URL inválida',
				email: 'Email inválido',
				phone: 'Teléfono inválido',
				cel: 'Celular inválido',
				number: 'El valor del campo '+this.field_label+' debe ser numérico',
				check: 'Valor invalido '+this.field_label
			},
          	en : {
          		required: 'The field '+this.field_label+' is required',
                minLength: 'The value in '+this.field_label+' is too short',
				text: 'The field '+this.field_label+' can\'t be a number',
				url: 'Invalid URL',
				email: 'Invalid email',
				phone: 'Invalid phone',
				cel: 'Invalid mobile number',
				number: 'The field '+this.field_label+' must be numeric',
				check: 'Must be checked '+this.field_label
            }
		}

		return error_messages[this.language][this.rule];

	}

	//------ LIMPIEZA DE ERRORES --------//

	activateCleanErrorOnFocus(){				
		var activate_clean_functions = {
			alert : () => this.activateCleanAlertError(),
			placeholder : () => this.activateCleanPlaceholderError(),
			tooltip : () => this.activateCleanTooltipError()
		};

		if(activate_clean_functions[this.field_error_type]!=undefined)
		activate_clean_functions[this.field_error_type]();
	}

	activateCleanAlertError(){
		$(this.frm_id+' .alert_val').each(function(){
			$(this).unbind('focus').on('focus', () => {
				$(this).removeClass('error_class');
			});
		});
	}

	activateCleanPlaceholderError(){		
		$(this.frm_id+' .placeholder_val').each(function(){
			$(this).unbind('focus').on('focus', () => {					
				var original_placeholder = $(this).attr('data-original-ph');
				$(this).removeAttr('data-original-ph');
				$(this).attr('placeholder', original_placeholder);
				$(this).removeClass('error_class');
			});
		});
	}

	activateCleanTooltipError(){				
		$(this.frm_id+' .tooltip_error').each((index) => {			
			var tooltip_error = $(this.frm_id+' .tooltip_error').eq(index);
			tooltip_error.unbind('focus').on('focus', () => {				
				this.Opentip.splice(index, 1);
				var tooltip_error_parent = (tooltip_error.parent().hasClass('outer_tooltip')) ? tooltip_error.parent().parent() : tooltip_error.parent();

				tooltip_error.removeClass('tooltip_background tooltip_error');
				tooltip_error.removeClass('error_class');
				tooltip_error_parent.find('.tooltip_alert').remove();			
			});
		});
	}

	//------ FUNCIONES COMPLEMENTARIAS --------//
	formToJSON(form){	
		var form_array = form.serializeArray();
		var form_JSON = {}
		$(form_array).each(function(index, obj){
			form_JSON[obj.name] = obj.value;
		});
		return form_JSON;
	}

	//Requiere la librería Opentip
	generateTooltips(){	
		$('.opentip-container').remove();
		if($(this.frm_id+' .tooltip_alert').length){
			this.Opentip = [];		
			$(this.frm_id+' .tooltip_alert').each((index) => {
				var tooltip_alert = $(this.frm_id+' .tooltip_alert').eq(index);
				var tool_tip_message = $(this.frm_id+' .tooltip_alert').eq(index).data('ot');
	  			this.Opentip.push(new Opentip(tooltip_alert, tool_tip_message, {target: true, showOn: 'mouseover', style: 'alert', tipJoint:'right'}));
			});		
		}
	}

}