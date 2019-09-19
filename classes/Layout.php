<?php 

class Layout{
    
    public $head;
    public $partials_path;

    public function __construct(){
        $this->partials_path = $_SERVER['DOCUMENT_ROOT'].'/assets/php';
    }

    public function head(){

        $this->head = '
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <script src="/assets/js/jquery.js"></script>
                <script src="/assets/js/popper.js"></script>
                <script src="/assets/js/bootstrap.bundle.min.js"></script>
                <script src="/assets/js/common.js"></script>
                <script src="/assets/js/opentip-jquery.js"></script>
                <script src="/assets/js/formvalidator.js"></script>
                <link rel="stylesheet" type="text/css" href="/assets/css/bootstrap.min.css">
                <link rel="stylesheet" type="text/css" href="/assets/css/simple-sidebar.css">
                <link rel="stylesheet" type="text/css" href="/assets/css/all.css">
                <link rel="stylesheet" type="text/css" href="/assets/css/opentip.css">
                <link rel="stylesheet" type="text/css" href="/assets/css/main.css">
            </head>
        ';

        return $this->head;
    }

    public function bodyStart($args = null){
        include $this->partials_path.'/_body_start.php';
    }

    public function bodyEnd($args = null){
        include $this->partials_path.'/_body_end.php';
    }

    public function navbar($args = null){
        include $this->partials_path.'/_navbar.php';
    }

    public function sidebar($args = null){
        include $this->partials_path.'/_sidebar.php';
    }

    public function pageStart($args = null){
        include $this->partials_path.'/_page_start.php';
    }

    public function pageEnd($args = null){
        include $this->partials_path.'/_page_end.php';
    }

}

?>