console.log('Bienvenidos al simulador interactivo \nCotizador de impresiones en gran formato:');

//valor del metro lineal o cudrado de cada material:
const valorMetroLinealVinilo = 13600;
const valorMetroLinealLona = 15000;
const valorMetroLinealFotografico = 13000;
const valorMetroLinealPropalcote = 4600;
const valorMetroCuadradoLienzo = 75000;

//valor del metro lineal de los tubos de aluminio que se usa para el pendon publisictario:
const valorMetroTuboAluminio = 5000;

//valor de la impresión por metro cuadrado en el plotter de impresión en gran formato HP-Latex-540:
const valorMetroCuadradoPloteo = 25000;
const valorMinimoPloteo = 10000;
const valorMetroPloteoLienzo = 50000;
const valorMinimoPloteoLienzo = 12500;
const valorMinimoMaterialLienzo = 12500;

// variable que guarda el tamaño minimo
const medidaMinima = 20;

//valor del servicio de corte para el vinilo adhesivo:
const valorMetroLinealCorte = 7800;

//objeto producto cotizado
let producto = {};
let cuerpo = document.getElementById('cuerpo');

// contador
let contador = 0;
if (localStorage.getItem(0) === null || localStorage.getItem(0) == 0) {
    console.log(' no existe');
    localStorage.setItem(0, contador);
    cuerpo.innerHTML = 'No has hecho ninguna cotización';

} else {
    contador = localStorage.getItem(0);
    console.log(localStorage.getItem(0));
    listarImpresionesCotizadas();
}

//funciones:

//funsión que me retorna el ancho máximo dependiendo del material seleccionado
function validarMaterial() {
    // variable que me trae el elemento de id= ancho
    let ancho = parseInt(document.getElementById('ancho').value);
    // variable que me trae el elemento de id= alto
    let alto = parseInt(document.getElementById('alto').value);
    // variable que me trae el material seleccionado
    let material = document.getElementById('material').value;
    // variable que guarda el ancho máximo permitido

    let objeto = { ancho: ancho, alto: alto, material: material, anchoMaximo: 0 };
    switch (material) {
        case 'Vinilo':
            objeto.anchoMaximo = 130;
            if (validarMedidasGeneral(objeto)) {
                precioProducto(objeto, valorMetroLinealVinilo);
            }
            break;
        case 'Lona':
            objeto.anchoMaximo = 130;
            if (validarMedidasGeneral(objeto)) {
                precioProducto(objeto, valorMetroLinealLona);
            }
            break;

        case 'Pendón Vertical':
            objeto.anchoMaximo = 130;
            if (ancho <= alto) {
                if (validarMedidasGeneral(objeto)) {
                    precioProducto(objeto, valorMetroLinealLona);
                }
            } else {
                //sweet alert
                Swal.fire({
                    confirmButtonColor: '#000',
                    title: 'Advertencia!',
                    text: 'En el pendón vertical el ancho no debe ser mayor al alto',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                })
            }
            break;

        case 'Pendón Horizontal':
            if (alto <= ancho) {
                if (ancho <= 130) {
                    objeto.anchoMaximo = 130;
                } else {
                    objeto.anchoMaximo = 120;
                }
                if (validarMedidasGeneral(objeto)) {
                    precioProducto(objeto, valorMetroLinealLona);
                }
            } else {
                //sweet alert
                Swal.fire({
                    confirmButtonColor: '#000',
                    title: 'Advertencia!',
                    text: 'En el pendón Horizontal el alto no debe ser mayor al ancho',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                })
            }
            break;

        case 'Lienzo':
            objeto.anchoMaximo = 125;
            if (validarMedidasGeneral(objeto)) {
                precioProductoLienzo(objeto, valorMetroCuadradoLienzo);
            }
            break;
        case 'Propalcote':
            objeto.anchoMaximo = 130;
            if (validarMedidasGeneral(objeto)) {
                precioProducto(objeto, valorMetroLinealPropalcote);
            }
            break;
        case 'Fotográfico':
            objeto.anchoMaximo = 70;
            if (validarMedidasGeneral(objeto)) {
                precioProducto(objeto, valorMetroLinealFotografico);
            }
            break;
    }
}

function validarMedidasGeneral(objetoValidar) {
    // aplico el operador lógico AND
    let validacion = false;
    if (objetoValidar.ancho >= medidaMinima && objetoValidar.alto >= medidaMinima) {
        // aplico el operador Ternario y el operadpor lógico OR
        objetoValidar.ancho <= objetoValidar.anchoMaximo || objetoValidar.alto <= objetoValidar.anchoMaximo ? validacion = true :
            //sweet alert
            Swal.fire({
                confirmButtonColor: '#000',
                title: 'Advertencia!',
                text: `Alguna de las dos medidas debe ser menor o igual a ${objetoValidar.anchoMaximo}`,
                icon: 'warning',
                confirmButtonText: 'OK'
            })
    }
    else {
        //sweet alert
        Swal.fire({
            confirmButtonColor: '#000',
            title: 'Advertencia!',
            text: `Ambas medidas deben ser de mínimo ${medidaMinima} cm`,
            icon: 'warning',
            confirmButtonText: 'OK'
        })
    }
    return validacion;
}

// función que calcula en precio de las impresiones generales
function precioProducto(objetoValidado, valorMetromaterialProducto) {
    // calculo el precio del ploteo
    let precioPloteo = (Math.round(((objetoValidado.ancho / 100) * (objetoValidado.alto / 100) * valorMetroCuadradoPloteo) / 1000)) * 1000;
    if (precioPloteo < valorMinimoPloteo) {
        precioPloteo = valorMinimoPloteo;
    }
    // calculo el precio del material
    let precioMaterial = 0;
    if (objetoValidado.ancho > objetoValidado.anchoMaximo) {
        precioMaterial = (objetoValidado.ancho / 100) * (valorMetromaterialProducto);
    } else if (objetoValidado.alto > objetoValidado.anchoMaximo) {
        precioMaterial = (objetoValidado.alto / 100) * (valorMetromaterialProducto);
    } else if (objetoValidado.ancho < objetoValidado.alto) {
        precioMaterial = (objetoValidado.ancho / 100) * (valorMetromaterialProducto);
    } else {
        precioMaterial = (objetoValidado.alto / 100) * (valorMetromaterialProducto);
    }
    precioMaterial = (Math.ceil(precioMaterial / 1000)) * 1000;
    let valorTubos = 0;
    if (objetoValidado.material == 'Pendón Vertical' || objetoValidado.material == 'Pendón Horizontal') {
        valorTubos = (objetoValidado.ancho / 100) * valorMetroTuboAluminio * 2;
    }
    // sumamos en precio del ploteo mas el precio del material
    let precio = precioMaterial + precioPloteo + valorTubos;
    // llamo a agregar cotizacion:
    agregarCotizacion(objetoValidado, precio);
}

// función especial para calcular el valor del lienzo
function precioProductoLienzo(lienzoValidado) {
    // calculo el precio del ploteo del lienzo
    let precioPloteo = (Math.round(((lienzoValidado.ancho / 100) * (lienzoValidado.alto / 100) * valorMetroPloteoLienzo) / 1000)) * 1000;
    if (precioPloteo < valorMinimoPloteoLienzo) {
        precioPloteo = valorMinimoPloteoLienzo;
    }
    // calculo el precio del material del lienzo
    let precioMaterial = ((lienzoValidado.ancho + 10) / 100) * ((lienzoValidado.alto + 10) / 100) * 75000;
    precioMaterial = parseInt(precioMaterial);
    precioMaterial = (Math.ceil(precioMaterial / 1000)) * 1000;
    if (precioMaterial < valorMinimoMaterialLienzo ) {
        precioMaterial = valorMinimoMaterialLienzo;
    }
    // sumamos en precio del ploteo mas el precio del material
    let precio = precioMaterial + precioPloteo;
    // llamo a agregar cotizacion:
    agregarCotizacion(lienzoValidado, precio);

    console.log(precioMaterial);
    console.log(precioPloteo);
    
}

// Función agregar a la lista de cotizaciones
function agregarCotizacion(objetoValidado, precio) {
    // variable que me trae el elemento id= resultado
    let resultado = document.getElementById('resultado');
    // le asigno el nuevo valor al elemento de id resultado
    resultado.innerHTML = `El precio de tu ${objetoValidado.material} es: $${precio} Cop`;
    // variable que me trae el parrafo del mensaje del iva
    let mensajeIva = document.getElementById('mensajeIva');
    // le cambio el display al mensaje iva
    mensajeIva.className = 'visible';
    // aplico el operador ++
    contador++;
    // creo el objeto producto
    producto = { id: contador, material: objetoValidado.material, ancho: objetoValidado.ancho, alto: objetoValidado.alto, costo: precio };
    //agrego el conTador
    localStorage.setItem(0, contador);
    //convierto en json el objeto
    const enJSON = JSON.stringify(producto);
    //agrego el jason al localstorage
    localStorage.setItem(producto.id, enJSON);
    // llamo a la función listar
    listarImpresionesCotizadas();
}


// lista de impresiones cotizadas
function listarImpresionesCotizadas() {
    let listaImpresiones = [];
    cuerpo = document.getElementById('cuerpo');
    cuerpo.innerHTML = '';

    //recorro el storage
    for (let i = 1; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        //convierto json a onjeto
        const traeObjeto = JSON.parse(localStorage.getItem(clave));
        //agrego el objeto a la lista
        listaImpresiones.push(traeObjeto);
    }

    // ordeno la lista 
    listaImpresiones.sort(function (a, b) {
        if (a.id > b.id) {
            return 1;
        }
        if (a.id < b.id) {
            return -1;
        }
        // a = b
        return 0;
    });

    let sumaTotal = 0;

    //recorro la lista de impresiones cotizadas
    listaImpresiones.forEach(p => {
        // creamos elemento de tipo li
        let li = document.createElement('li');

        if (p.id) {
            // le asignamos contenido al li
            li.innerHTML = `${p.id}:  ${p.material} de ${p.ancho}cm de ancho por ${p.alto}cm de alto - Precio: <b>$${p.costo}</b> `;
            //agregamos el elemento al padre
            cuerpo.append(li);
            console.log(p);
            sumaTotal = sumaTotal + p.costo;
        }
    });

    // variable que me trae el elemento id= resultadoTotal
    let resultadoTotal = document.getElementById('resultadoTotal');
    // le asigno el nuevo valor al elemento de id resultado
    resultadoTotal.innerHTML = `El total de tu cotización es: $${sumaTotal} + IVA`;
}

// funcion que borra el local storage y recarga la pagina
function resetear() {
    Swal.fire({
        title: 'Estás seguro de borrar todo',
        text: "Se eliminarán todos los datos almacenados",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#000',
        confirmButtonText: 'Si, borrar todo!',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                localStorage.clear(),
                window.location.reload()
            )
        }
    })
}

// Botón 
let boton = document.getElementById('button');
boton.addEventListener('click', validarMaterial);

// Botón reset
let botonReset = document.getElementById('buttonReset');
botonReset.addEventListener('click', resetear);

