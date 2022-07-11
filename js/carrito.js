//trae los elementos del html
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const pedido = document.getElementById('btn-pedido')
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
//donde se guardaran los items del carrito
let carrito = {}

document.addEventListener('DOMContentLoaded', () => { fetchData()
    //lo guarda en el localStorage
    if(localStorage.getItem('carritoC')){
        carrito = JSON.parse(localStorage.getItem('carritoC'))
        pintarCarrito()
    }
    pedir()
})

items.addEventListener('click', e => { btnAumentarDisminuir(e) })

// Traer items del .json
const fetchData = async () => {
    const res = await fetch('products.json')
    //const data = await res.json()
    //console.log(data)
    //pintarCards(data)
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
        templateCarrito.querySelector('.btn-outline-success').dataset.id = producto.id
        templateCarrito.querySelector('.btn-outline-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
    //agarra del localStorage y lo pone de nuez en el carrito
    localStorage.setItem('carritoC', JSON.stringify(carrito))
    pedir()   
}
//aparece o no el carrito de compra segun si tiene items o no
const pintarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">¡Carrito de compras vacío, agrega artículos a la lista!</th>
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
    
}

//btn de sumar o restar el # de productos
const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    //accion de aumentar
    if (e.target.classList.contains('btn-outline-success')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }
    //dismuir items
    if (e.target.classList.contains('btn-outline-danger')) {
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
//btn pedir
const pedir = () => {
    //pasa carrito a string
    const pedido_carrito = JSON.stringify(carrito)

    const remplace1 = /{/ig
    const pedido_clean1 = pedido_carrito.replace(remplace1, " /")

    const remplace2 = /}/ig
    const pedido_clean2 = pedido_clean1.replace(remplace2, "/ ")

    const remplace3 = /"/ig
    const pedido_clean3 = pedido_clean2.replace(remplace3, "")
    
    const remplace4 = /title:/ig
    const pedido_clean4 = pedido_clean3.replace(remplace4, "Nombre del pack: ")

    const remplace5 = /precio:/ig
    const pedido_clean5 = pedido_clean4.replace(remplace5, "Precio c/p: ")

    const remplace6 = /id:/ig
    const pedido_clean6 = pedido_clean5.replace(remplace6, "Id: ")

    const remplace7 = /cantidad:/ig
    const pedido_clean7 = pedido_clean6.replace(remplace7, "Cantidad: ")

    //el string de carrito se hace encodeURI mas el link de wp numero
    const msg_wp = "https://api.whatsapp.com/send?phone=525576442493&text=Hola%2c+buen+d%c3%ada%2c+quiero+comprar+los+siguientes+art%c3%adculos%3a+"
    const pedido_wp = msg_wp + encodeURIComponent(pedido_clean7)
    //pone el enlace completo en el btn pedido
    pedido.querySelector('a').setAttribute('href', pedido_wp)
}
