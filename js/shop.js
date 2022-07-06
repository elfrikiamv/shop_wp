//trae los elementos del html
const cards = document.getElementById('cards')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
let carrito = {}

// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => { 
    fetchData()
})

//obtener los elementos de la card
cards.addEventListener('click', e => {
    addCarrito(e) 
})

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

    //agarra del localStorage y lo pone de nuez en el carrito
    localStorage.setItem('carritoC', JSON.stringify(carrito))
}