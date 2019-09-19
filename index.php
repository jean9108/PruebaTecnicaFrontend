<?php 

include $_SERVER['DOCUMENT_ROOT'].'/classes/Router.php';
include $_SERVER['DOCUMENT_ROOT'].'/classes/Layout.php';

//Enrutador de vistas
$router = new Router();
$view = $router->getView();

//Generador de assets y componentes html
$layout = new Layout();

//Carga de assets en el head
echo $layout->head();

//-------- Carga de body ----------

//--------------
echo $layout->bodyStart();
//--------------
    echo $layout->sidebar();
    echo $layout->pageStart();
        echo $layout->navbar();
        if(is_file($view)){
            include $view;
        } else {
            include $router->errorPage();
        }
    echo $layout->pageEnd();
//--------------
echo $layout->bodyEnd();
//--------------
?>