const products = [
    { id: 1, name: 'همبرگر معمولی', price: 8000, image: 'hamburger.png' },
    { id: 2, name: 'همبرگر مخصوص', price: 10000, image: 'hamburger.png' },
    { id: 3, name: 'همبرگر معمولی با قارچ و پنیر', price: 10000, image: 'hamburger.png' },
    { id: 4, name: ' همبرگر مخصوص با قارچ و پنیر', price: 10000, image: 'hamburger.png' },
    { id: 5, name: 'سیب زمینی سرخ کرده ویژه', price: 25000, image: 'french_fries.png' },
    { id: 6, name: 'سیب زمینی سرخ کرده' ,price: 10000, image: 'french_fries.png' },
    { id: 7, name: 'نوشابه رژیمی', price: 6000, image: 'soda.png' },
    { id: 8, name: 'نوشابه', price: 5000, image: 'soda.png' },
    { id: 9, name: 'سالاد سزار', price: 25000, image: 'ceasar.png' },
    { id: 10, name: 'سالاد فصل', price: 8000, image: 'salad.png' },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let discountCodes = {
    gold: 3,
    silver: 2,
    bronze: 1
};

function displayProducts() {
    const menu = document.querySelector('.menu');
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="Assets/img/${product.image}" alt="${product.name}">
            <div class="information">
                <h3>${product.name}</h3>
                <p>${product.price.toFixed(0)} تومان </p>
                <input class="inputbtn" type="button" value="-" onClick="combinedFunction('minus', ${product.id})">
                <input class="inputin" type="text" id="myVal-${product.id}" name="count" value="0">
                <input class="inputbtn" type="button" value="+" onClick="combinedFunction('add', ${product.id})">
            </div>
        `;
        menu.appendChild(productElement);
    });
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    const existingItem = cart.find(item => item.id === productId); 
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    localStorage.setItem('cart', JSON.stringify(cart));
}

function minusToCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

function minus(productId) {
    var oldVal = parseInt(document.getElementById("myVal-" + productId).value);
    oldVal = Math.max(0, oldVal - 1);
    document.getElementById("myVal-" + productId).value = oldVal;
}

function add(productId) {
    var oldVal = parseInt(document.getElementById("myVal-" + productId).value);
    oldVal++;
    document.getElementById("myVal-" + productId).value = oldVal;
}

function combinedFunction(action, productId) {
    if (action === 'add') {
        addToCart(productId);
        add(productId);
    } else if (action === 'minus') {
        minusToCart(productId);
        minus(productId);
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartDiscount = document.getElementById('cart-discount');
    const cartServiceFee = document.getElementById('cart-service-fee');
    const cartsum = document.getElementById('cart-sum');
    cartItems.innerHTML = '';
    
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    cartTotal.textContent = total.toFixed(0);
    const discountValue = calculateDiscount(total);
    cartDiscount.textContent = discountValue.toFixed(0) / 100;
    cartServiceFee.textContent = calculateServiceFee(total).toFixed(0);
    cartsum.textContent = ((total + calculateServiceFee(total)) - discountValue);

    localStorage.setItem('cart', JSON.stringify(cart));
}

function calculateDiscount(total) {
    const discountCode = document.getElementById('discount-code').value.toLowerCase();
    if (discountCode) {
        if (discountCodes.hasOwnProperty(discountCode)) {
            const discount = discountCodes[discountCode];
            return (total * (discount / 100));
        } else {
            alert('The discount code is not correct.');
            return 0; 
        }
    }
    return 0; 
}

function calculateServiceFee(total) {
    const serviceFeePercentage = 0.05;
    return total * serviceFeePercentage;
}

function applyDiscount() {
    updateCart();
}

function checkout() {
    cart = [];
    updateCart();
    document.getElementById('model').style.display = 'block';
    localStorage.removeItem('cart');
}

function closeModal() {
    document.getElementById('model').style.display = 'none';
}

window.addEventListener('load', () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCart();
});
displayProducts();
