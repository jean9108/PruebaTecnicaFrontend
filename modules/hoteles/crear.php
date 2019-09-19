<div class="container-fluid">
    <h1 class="mt-4">Crear hotel</h1>
    <form id="frmCrearHotel" class="col-lg-5 p-0 position-relative">
        <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input name="nombre" type="text" class="form-control">
        </div>
        <div class="form-group">
            <label for="nit">NIT:</label>
            <input name="nit" type="text" class="form-control">
        </div>
        <div class="form-group">
            <label for="direccion">Dirección:</label>
            <input name="direccion" type="text" class="form-control">
        </div>
        <div class="form-group">
            <label for="num_habitaciones">Número de habitaciones:</label>
            <input name="num_habitaciones" type="text" class="form-control">
        </div>
        <button type="button" class="btn btn-primary" id="crearHotel">Submit</button>
    </form>
</div>

<script src="/modules/hoteles/js/hoteles.js"></script>