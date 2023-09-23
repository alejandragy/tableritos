/* clases */
class Tarea {
    constructor(id, titulo) {
        this.id = id;
        this.titulo = titulo;
        this.realizada = false;
    }
}

class Tablero {
    constructor(titulo, id) {
        this.id = id;
        this.titulo = titulo;
        this.tareas = [];
    }
}


/* trayendo elementos de DOM */
const inputTablero = document.getElementById('inputTablero');
const btnTablero = document.getElementById('btnTablero');
const ulTableros = document.getElementById('listaTableros');
const tituloTablero = document.getElementById('tituloTablero');
const inputTarea = document.getElementById('inputTarea');
const btnTarea = document.getElementById('btnTarea');
const ulTareas = document.getElementById('listaTareas');
const txtNotas = document.getElementById('notas');


/* variables globales y localStorage */
//tableros
let totalTableros;
localStorage.getItem('totalTableros') ? totalTableros = JSON.parse(localStorage.getItem('totalTableros')) : totalTableros = [];
let contIdTableros = 0;
localStorage.getItem('contadorIdTableros') ? contIdTableros = JSON.parse(localStorage.getItem('contadorIdTableros')) : contIdTableros = parseInt('0');
let idTableroSeleccionado;
//tareas
let contIdTareas = 0;
localStorage.getItem('contadorIdTareas') ? contIdTareas = JSON.parse(localStorage.getItem('contadorIdTareas')) : contIdTareas = parseInt('0');
let idTareaSeleccionadaDOM;
//notas
let notas;
localStorage.getItem('notas') ? notas = localStorage.getItem('notas') : notas = '';



/* traer de LS al cargar la página */
function tablerosDesdeLS() {
    const tableros = JSON.parse(localStorage.getItem('totalTableros'));
    tableros.forEach(tablero => { crearTableroDOM(tablero) });
}


window.addEventListener('load', () => { localStorage.getItem('totalTableros') && tablerosDesdeLS(); txtNotas.value = notas; })





/* tableros */
//funciones
function crearObjetoTablero(titulo, id) {
    const tableroNuevo = new Tablero(titulo, id);
    totalTableros.push(tableroNuevo);
    contIdTableros += 1;
    localStorage.setItem('totalTableros', JSON.stringify(totalTableros));
    localStorage.setItem('contadorIdTableros', contIdTableros);
    return tableroNuevo;
}

function crearTableroDOM(objetoTablero) {
    //crear li tablero
    let liTablero = document.createElement('li');
    liTablero.classList.add('flex', 'w-300', 'gap-2', 'rounded-md', 'mb-3', 'bg-violet-300', 'shadow-md',  'shadow-slate-300', 'md:ml-3');
    liTablero.setAttribute('id', `tablero-${objetoTablero.id}`)
    ulTableros.append(liTablero);

    //crear boton tablero
    let buttonTablero = document.createElement('button');
    buttonTablero.classList.add('w-64', 'text-left', 'pl-2', 'h-16', 'text-white', 'rounded-l-md', 'text-lg', 'tablero');
    buttonTablero.innerText = `${objetoTablero.titulo}`;
    liTablero.append(buttonTablero);

    //crear boton eliminar tablero
    let buttonEliminar = document.createElement('button');
    buttonEliminar.classList.add('mr-3', 'pl-2', 'opacity-30', 'hover:opacity-100');
    buttonEliminar.innerHTML = `<img class= "h-5 w-5" src="./img/borrar.png" alt="eliminar">`;
    liTablero.append(buttonEliminar);

    //evento para seleccionar tablero
    buttonTablero.addEventListener('click', () => {
        seleccionarTablero()
        tituloTablero.innerText = `${objetoTablero.titulo}`
        idTableroSeleccionado = objetoTablero.id;
        ulTareas.innerHTML = "";
        mostrarTareas(seleccionarTablero());
    })

    //evento para eliminar tablero
    buttonEliminar.addEventListener('click', ()=> {
        //eliminar objeto
        idTableroSeleccionado = objetoTablero.id;
        const tableroSeleccionado = seleccionarTablero()
        const liTablero = buttonEliminar.parentNode;
        const indexTableroSeleccionado = totalTableros.indexOf(tableroSeleccionado);
        totalTableros.splice(indexTableroSeleccionado, 1);
        localStorage.setItem('totalTableros', JSON.stringify(totalTableros));
        //eliminar en DOM
        liTablero.remove();
        tituloTablero.innerText = 'Selecciona o crea un tablero';
        ulTareas.innerText = '';
    })

}

function seleccionarTablero() {
    const tableroSeleccionado = totalTableros.find((tablero) => tablero.id === idTableroSeleccionado);
    return tableroSeleccionado;
}

//eventos para crear tableros
btnTablero.addEventListener('click', () => {
    if (inputTablero.value) {
        crearTableroDOM(crearObjetoTablero(inputTablero.value, contIdTableros));
        inputTablero.value = null;
    }
});

inputTablero.addEventListener('keyup', function (e) {
    if (e.key == 'Enter') {
        if (inputTablero.value) {
            crearTableroDOM(crearObjetoTablero(inputTablero.value, contIdTableros));
            inputTablero.value = null;
        }
    }
});



/* tareas */
function agregarTarea(tablero, tarea) {
    tablero.tareas.push(tarea);
}

//funciones
function crearObjetoTarea(id, tarea) {
    const nuevaTarea = new Tarea(id, tarea);
    const tableroSeleccionado = seleccionarTablero();
    agregarTarea(tableroSeleccionado, nuevaTarea);
    contIdTareas += 1;
    localStorage.setItem('totalTableros', JSON.stringify(totalTableros));
    localStorage.setItem('contadorIdTareas', JSON.stringify(contIdTareas));
    return nuevaTarea;
}

function crearTareaDOM(objetoTarea) {
    //crear li tarea
    let liTarea = document.createElement('li');
    liTarea.classList.add('w-300', 'min-h-10', 'max-h-28', 'mb-3', 'flex', 'justify-between', 'rounded-md', 'border-solid', 'border-slate-100', 'border-2', 'lg:w-360', `${objetoTarea.id}`)
    liTarea.setAttribute('id', `${objetoTarea.id}`);
    ulTareas.append(liTarea);

    //crear btn tarea pendiente
    let buttonEstado = document.createElement('button');
    buttonEstado.classList.add('mr-2');
    objetoTarea.realizada ? buttonEstado.innerHTML = `<img class= "h-5 ml-2" src="./img/listo.png" alt="realizada">` : buttonEstado.innerHTML = `<img class= "h-5 ml-2" src="./img/pendiente.png" alt="pendiente">`;
    liTarea.append(buttonEstado);

    //crear titulo de tarea
    let pTarea = document.createElement('p');
    objetoTarea.realizada ? pTarea.classList.add('w-60', 'p-1', 'text-gray-800', 'lg:w-280', 'line-through') : pTarea.classList.add('w-60', 'p-1', 'text-gray-800', 'lg:w-280');
    pTarea.innerText = `${objetoTarea.titulo}`
    liTarea.append(pTarea);

    //crear boton eliminar
    let buttonEliminar = document.createElement('button');
    buttonEliminar.classList.add('mr-3', 'opacity-30', 'hover:opacity-100');
    buttonEliminar.innerHTML = `<img class= "h-5 w-5" src="./img/borrar.png" alt="eliminar">`;
    liTarea.append(buttonEliminar);

    buttonEstado.addEventListener('click', () => {
        const liTarea = buttonEstado.parentNode;
        idTareaSeleccionadaDOM = liTarea.id; //asigna el valor a la variable global idTareaSeleccionada para usar después en la funcion seleccionarTarea
        //marcar como realizada
        const tareaSeleccionada = seleccionarTarea();
        if (tareaSeleccionada.realizada === false) {
            //marcar como realizada
            tareaSeleccionada.realizada = true;
            localStorage.setItem('totalTableros', JSON.stringify(totalTableros));
            //marcar como realizada en DOM
            buttonEstado.innerHTML = '';
            buttonEstado.innerHTML = `<img class= "h-5 ml-2" src="./img/listo.png" alt="realizada">`;
            pTarea.classList.add('line-through');
        }
        else {
            //marcar como pendiente
            tareaSeleccionada.realizada = false;
            localStorage.setItem('totalTableros', JSON.stringify(totalTableros));
            //marcar como pendiente en DOM
            buttonEstado.innerHTML = '';
            buttonEstado.innerHTML = `<img class= "h-5 ml-2" src="./img/pendiente.png" alt="realizada">`;
            pTarea.classList.remove('line-through');
        }
    })

    buttonEliminar.addEventListener('click', ()=> {
        const liTarea = buttonEliminar.parentNode;
        //eliminar objeto
        const tareaSeleccionada = seleccionarTarea(); 
        const tareasDelTablero = seleccionarTablero().tareas;
        const indexTareaSeleccionada = tareasDelTablero.indexOf(tareaSeleccionada);
        tareasDelTablero.splice(indexTareaSeleccionada, 1);
        localStorage.setItem('totalTableros', JSON.stringify(totalTableros));
        //eliminar en DOM
        liTarea.remove();  
    })
}

function mostrarTareas(tableroSeleccionado) {
    for (let i = 0; i < tableroSeleccionado.tareas.length; i++) { crearTareaDOM(tableroSeleccionado.tareas[i]) }
}

function borrarTareas(){

}

function seleccionarTarea(tablero) {
    const tableroSeleccionado = seleccionarTablero();
    const tareasDelTablero = tableroSeleccionado.tareas;
    const tareaSeleccionada = tareasDelTablero.find((tarea) => tarea.id === idTareaSeleccionadaDOM);
    return tareaSeleccionada;
}

//eventos para crear tareas
btnTarea.addEventListener('click', () => {
    if (inputTarea.value) {
        const nuevaTarea = crearObjetoTarea(`tarea-${contIdTareas}`, inputTarea.value);
        crearTareaDOM(nuevaTarea);
        inputTarea.value = null;
    }
});

inputTarea.addEventListener('keyup', function (e) {
    if (e.key == 'Enter') {
        if (inputTarea.value) {
            const nuevaTarea = crearObjetoTarea(`tarea-${contIdTareas}`, inputTarea.value);
            crearTareaDOM(nuevaTarea);
            inputTarea.value = null;
        }
    }
});

/* notas */
txtNotas.addEventListener('input', () => { const notas = txtNotas.value; localStorage.setItem('notas', notas) });