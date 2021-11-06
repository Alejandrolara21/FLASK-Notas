document.addEventListener('DOMContentLoaded', function(){
    crearNota();
    cambiarEstado();
    eliminarNota();
    cambiarFormulario();
    actualizarNota();
});

function cargarListado(datos,cambiarForm = 0){
    const listado = document.querySelector('#listadoNotas');
    while(listado.firstChild){
        listado.removeChild(listado.firstChild);
    }
    listado.insertAdjacentHTML('afterbegin',datos);
    cambiarEstado();
    eliminarNota();
    cambiarFormulario(cambiarForm);
    actualizarNota();
}

function cambiarFormulario(cambiar = 0){
    if(document.querySelectorAll('.actualizarNota')[0]){
        const actualizarNotas = document.querySelectorAll('.actualizarNota');
        const divActualizar = document.querySelector('#formularioActualizar');
        const divCrear = document.querySelector('#formularioCrear');
        actualizarNotas.forEach(nota =>{
            nota.addEventListener('click', e=>{
                idNota = nota.dataset.actualizar;
                const tituloNota = document.querySelector(`.titulo${idNota}`).textContent;
                const descripcionNota = document.querySelector(`.descripcion${idNota}`).textContent;

                divActualizar.classList.remove('hidden');
                divCrear.classList.add('hidden');

                document.querySelector('#tituloActualizar').value = tituloNota;
                document.querySelector('#descripcionActualizar').value = descripcionNota;;
                document.querySelector('#idNota').value = idNota;
            });
        });

        if(cambiar != 0){
            divActualizar.classList.add('hidden');
            divCrear.classList.remove('hidden');
        }
    }
}

function actualizarNota(){
    if(document.querySelector('#botonActualizar')){
        const boton = document.querySelector('#botonActualizar');
        boton.addEventListener('click', e =>{
            e.preventDefault();
            const idNota = document.querySelector('#idNota').value;
            const titulo = document.querySelector('#tituloActualizar').value;
            const descripcion = document.querySelector('#descripcionActualizar').value;
            if(titulo != "" && descripcion != ""){
                objNota = {
                    'id': idNota,
                    'titulo': titulo,
                    'descripcion': descripcion
                }

                url = "/editarNota";
                fetch(url,{
                    method: 'POST',
                    body: JSON.stringify(objNota),
                    headers: {
                        'Content-Type': 'application/json'// AQUI indicamos el formato
                    }
                })
                .then(respuesta =>{
                    return respuesta.text();
                })
                .then(datos => {
                    cargarListado(datos,1);
                    mensajeFormulario("Nota Actualizada",1)
                })
            }else{
                mensajeFormulario("Todos los campos son obligatorios",0);
            }
        });
    }
}

function eliminarNota(){
    if(document.querySelectorAll('.eliminarNota')[0]){
        const iconosEliminar = document.querySelectorAll('.eliminarNota');

        iconosEliminar.forEach(icono =>{
            icono.addEventListener('click', e =>{
                e.preventDefault();
                idNota = icono.dataset.eliminar;
                url = `/eliminarNota?id=${idNota}`;
                fetch(url,{
                    method: 'GET',
                    headers: {},
                })
                .then(respuesta =>{
                    return respuesta.text();
                })
                .then(datos =>{
                    cargarListado(datos);
                    mensajeLista("Nota Eliminada",1);
                })
            });
        });
    }
}

function crearNota(){
    if(document.querySelector('#botonNota')){
        const boton = document.querySelector('#botonNota');
        boton.addEventListener('click', e =>{
            e.preventDefault();
            const titulo = document.querySelector('#titulo').value;
            const descripcion = document.querySelector('#descripcion').value;

            if(titulo != "" && descripcion != ""){
                objNota = {
                    'titulo':titulo,
                    'descripcion': descripcion
                }
    
                url = "/agregarNota";
                fetch(url,{
                    method: 'POST',
                    body: JSON.stringify(objNota),
                    headers: {
                        'Content-Type': 'application/json'// AQUI indicamos el formato
                    }
                })
                .then(respuesta =>{
                    return respuesta.text();
                })
                .then(datos => {
                    cargarListado(datos);
                    mensajeFormulario("Nota Agregada Correctamente",1);
                })
            }else{
                mensajeFormulario("Todos los campos son obligatorios",0);
            }
        });
    }
}

function mensajeFormulario(mensaje,tipo){
    if(document.querySelector('#formulario')){
        const alertaPrevia = document.querySelector('.alerta');
        if(alertaPrevia) {
            return;
        }
        const div = document.querySelector('#formulario');
        const alerta = document.createElement('DIV');
        alerta.textContent = mensaje;
        alerta.classList.add('alerta');
        if(tipo == 0){
            alerta.classList.add('error');
        }else if(tipo == 1){
            alerta.classList.add('exito');
        }
        div.insertAdjacentElement('beforeend',alerta);

        setTimeout( () => {
            alerta.remove();
        }, 3000);
    }
}

function mensajeLista(mensaje,tipo){
    if(document.querySelector('#listadoNotas')){
        const alertaPrevia = document.querySelector('.alerta');
        if(alertaPrevia) {
            return;
        }
        const div =document.querySelector('#listadoNotas');
        const alerta = document.createElement('DIV');
        alerta.textContent = mensaje;
        alerta.classList.add('alerta');
        if(tipo == 0){
            alerta.classList.add('error');
        }else if(tipo == 1){
            alerta.classList.add('exito');
        }
        div.insertAdjacentElement('afterbegin',alerta);

        setTimeout( () => {
            alerta.remove();
        }, 3000);
    }
}

function cambiarEstado(){
    if(document.querySelectorAll('.estado')[0]){
        const estados = document.querySelectorAll('.estado');
        estados.forEach(estado => {
            estado.addEventListener('change', e=>{
                valorEstado = estado.value;
                idNota =e.target.dataset.idnota;
                objEstado = {
                    'id': idNota,
                    'estado': valorEstado
                }

                url = "/cambiarEstado";
                fetch(url,{
                    method: 'POST',
                    body: JSON.stringify(objEstado),
                    headers: {
                        'Content-Type': 'application/json'// AQUI indicamos el formato
                    }
                })
                    .then(respuesta =>{
                        return respuesta.text()
                    })
                    .then(datos =>{
                        cargarListado(datos);
                        mensajeLista("Estado Cambiado",1);
                    })
            });
        });
    }
}