const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
})
cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    buttonAction(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('carrito.json')
        const data = await res.json()
        seleCards(data)
    } catch (error) {
        console.log(error)
    }
}

const seleCards = data => {
    data.forEach(producto => {
       templateCard.querySelector('h5').textContent = producto.name
       templateCard.querySelector('p').textContent = producto.price
       templateCard.querySelector('img').setAttribute("src", producto.photo)
       templateCard.querySelector('button').dataset.id =producto.id

       const clone = templateCard.cloneNode(true)
       fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
        
    }
    e.stopPropagation()
}

const setCarrito = objecto => {
    const product = {
        id: objecto.querySelector('.btn-dark').dataset.id,
        title: objecto.querySelector('h5').textContent,
        price: objecto.querySelector('p').textContent,
        amount: 1
    }

    if (carrito.hasOwnProperty(product.id)) {
        product.amount = carrito[product.id].amount + 1
    }

    carrito[product.id] = {...product}
    seleCarrito()
}

const seleCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(shirts => {
        templateCarrito.querySelector('th').textContent = shirts.id
        templateCarrito.querySelectorAll('td')[0].textContent = shirts.title
        templateCarrito.querySelectorAll('td')[1].textContent = shirts.amount
        templateCarrito.querySelector('.btn-info').dataset.id = shirts.id
        templateCarrito.querySelector('.btn-danger').dataset.id = shirts.id
        templateCarrito.querySelector('span').textContent = shirts.amount * shirts.price

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })  
    items.append(fragment)

    seleFooter()
}

const seleFooter = ()=> {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `<th scope="row" colspan="2">Products Total</th>`

        return 
    }

    const nAmount = Object.values(carrito).reduce((plus, {amount})=> plus + amount,0)
    const nPrice = Object.values(carrito).reduce((plus, {amount, price}) => plus + amount * price, 0) 
    

    templateFooter.querySelectorAll('td')[0].textContent = nAmount
    templateFooter.querySelector('span').textContent = nPrice

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const buttonDelete = document.getElementById('delete-cart')
    buttonDelete.addEventListener('click', ()=> {
        carrito = {}
        seleCarrito()
    })
}

const buttonAction = e => {
    console.log(e.target)
    if(e.target.classList.contains('btn-info')){
        carrito[e.target.dataset.id]

        const product = carrito[e.target.dataset.id]
        product.amount + 1
        product.amount = carrito[e.target.dataset.id].amount + 1
        carrito[e.target.dataset.id] = {...product}
        seleCarrito()
    }
    if(e.target.classList.contains('btn-danger')) {
        const product = carrito [e.target.dataset.id]
        product.amount--
        if (product.amount === 0) {
            delete carrito[e.target.dataset.id]
        }
        seleCarrito()
    }

    e.stopPropagation()
}