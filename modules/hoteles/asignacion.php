<div class="container-fluid">
    <h1 class="mt-4">Crear asignación</h1>
    <div class="mt-3 mb-3"><i class="fas fa-bed"></i> Disponibilidad: <span id="numHabitacionesDisponibles"></span> de <span id="numHabitaciones"></span></div>
    <form data-id="<?=$router->getUrlPart(3)?>" id="frmCrearAsignacion" class="col-lg-5 p-0 position-relative">
        <div class="form-group">
            <label for="id_habitacion">Habitación:</label>
            <select name="id_habitacion" class="form-control">
                <option value="">Seleccionar</option>
            </select>
        </div>
        <div class="form-group">
            <label for="id_acomodacion">Acomodación:</label>
            <select name="id_acomodacion" type="text" class="form-control" disabled>
                <option value="">Seleccionar</option>
            </select>
        </div>
        <div class="form-group">
            <label for="cantidad">Número de habitaciones:</label>
            <input name="cantidad" type="text" class="form-control">
        </div>
        <button type="button" class="btn btn-primary" id="crearAsignacion">Crear</button>
    </form>
</div>

<script src="/modules/hoteles/js/hoteles.js"></script>