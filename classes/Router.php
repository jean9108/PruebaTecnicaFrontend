<?php 

class Router{

    public $url_array;
    public $num_url_levels;
    public $module_name;
    public $module_action;
    public $module_path;
    public $default_module;
    public $module_folder;

    function __construct()
    {
        //Convierte la URL en un array
        $this->url_array = explode('/', $_SERVER['REQUEST_URI']);
        $this->num_url_levels = count($this->url_array);

        //Extrae las partes de cada módulo
        $this->module_name = (isset($this->url_array[1])) ? $this->url_array[1] : '';
        $this->module_action = (isset($this->url_array[2])) ? $this->url_array[2] : '';

        //Módulo por defecto
        $this->default_module_path = '/hoteles';
        $this->default_module = $this->default_module_path.'/index.php';
        $this->module_folder = $_SERVER['DOCUMENT_ROOT'].'/modules';
    }

    function getView()
    {
        if($this->num_url_levels == 2 || $this->num_url_levels == 3)
        $this->module_path = $this->module_folder.$this->module_name;

        //Genera la vista según los casos
        if($this->num_url_levels == 2){
            $this->module_path = $this->module_folder.$this->default_module_path;
            return $this->module_folder.$this->default_module;
        }

        if($this->num_url_levels == 2)
        return $this->module_folder.'/'.$this->module_name.'/index.php';

        if($this->num_url_levels >= 3)
        return $this->module_folder.'/'.$this->module_name.'/'.$this->module_action.'.php';

    }

    function errorPage(){
        return $this->module_folder = $_SERVER['DOCUMENT_ROOT'].'/assets/php/error.php';
    }

    function getUrlPart($index){
        return $this->url_array[$index];
    }

}

?>