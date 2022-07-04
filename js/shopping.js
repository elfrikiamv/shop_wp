//trae los elementos del html
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templatePedir = document.getElementById('template-btnpedir').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
//donde se guardaran los items del carrito
let carrito = {}

// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => { fetchData()
    //lo guarda en el localStorage
    if(localStorage.getItem('carritoC')){
        carrito = JSON.parse(localStorage.getItem('carritoC'))
        pintarCarrito()
    }
})
//obtener los elementos de la card
cards.addEventListener('click', e => { addCarrito(e) });
items.addEventListener('click', e => { btnAumentarDisminuir(e) })

// Traer items del .json
const fetchData = async () => {
    const res = await fetch('products.json')
    const data = await res.json()
    //console.log(data)
    pintarCards(data)
}

// Pintar productos
const pintarCards = data => {
    data.forEach(producto => {
        //accede a los elentos del html y los pinta segun el .json
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        //pone id dinamico al boton segun la card
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

// Agregar al carrito
const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
// captura los elementos del add carrito y se guardan como objetos en set carrito
const setCarrito = objeto => {
    const producto = {
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        id: objeto.querySelector('.btn-dark').dataset.id,
        cantidad: 1
    }
    //console.log(producto)
     
    //llama al objeto id del producto del carrito para +1 en cantidad
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }
    //wea que contiene los datos del carrito de compras
    //converte objet to string
    //const pedido_carrito = JSON.stringify(carrito);
    //console.log(encodeURIComponent(pedido_carrito))

    pintarCarrito()
}

//pinta con los objetos del setcarrito los pinta en la tabla de carrito de compras
const pintarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
    //agarra del localStorage y lo pone de nuez en el carrito
    localStorage.setItem('carritoC', JSON.stringify(carrito))   
}
//aparece o no el carrito de compra segun si tiene items o no
const pintarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    
    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
    //console.log(nPrecio)
    //Pinta la cantidad y la suma de precios
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.querySelector('#vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

    //logica del btn pedir
    const clone2 = templatePedir.cloneNode(true)
    fragment.appendChild(clone2)
    footer.appendChild(fragment)

    const btnPedir = document.querySelector('#pedir-carrito')
    btnPedir.addEventListener('click', () => {
        
        //wea que contiene los datos del carrito de compras
        //converte objet to string y saca el url
        const pedido_carrito = JSON.stringify(carrito)
        const pedido_wp = "https://api.whatsapp.com/send?phone=525576442493&text=" + encodeURIComponent(pedido_carrito)

        window.open(pedido_wp, '_blank'); 
        //console.log(pedido_wp)

    })
    
}

//btn de sumar o restar el # de productos
const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    //accion de aumentar
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }
    //dismuir items
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation()
}
