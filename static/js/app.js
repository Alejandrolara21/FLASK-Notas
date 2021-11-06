document.addEventListener('DOMContentLoaded', function(){
    crearProducto();
    cambiarEstado();
});

function crearProducto(){
    if(document.querySelector('#botonNota')){
        const boton = document.querySelector('#botonNota');
        boton.addEventListener('click', e =>{
            e.preventDefault();
            const titulo = document.querySelector('#titulo').value;
            const descripcion = document.querySelector('#descripcion').value;

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
                return respuesta.json();
            })
            .then(datos => {
                console.log(datos);
            })
        });
    }
}

function cambiarEstado(){
    if(document.querySelectorAll('#estado')[0]){
        const estados = document.querySelectorAll('#estado');
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
                        console.log(datos);
                    })
            });
        });
    }
}