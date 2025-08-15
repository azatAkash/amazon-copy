export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    const selectedQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
    let matchingItem = findByProductId(productId);

    if (matchingItem) {
        matchingItem.quantity += selectedQuantity;
    } else {
        cart.push({
            productId,
            quantity: selectedQuantity,
            deliveryOptionId: '1'
        })
    }

    saveToStorage();
}

function findByProductId(productId) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    })
    return matchingItem;
}

export function removeFromCart(productId) {
    const newCart = [];
    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }

    })
    cart = newCart;
    saveToStorage();
}


export function updateDeliveryOption(productId, deliveryOptionId){
    let matchingItem = findByProductId(productId);

    matchingItem.deliveryOptionId = deliveryOptionId;

    saveToStorage();
}

export function updateCartItemQuantity(productId, newQuantity) {
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            cartItem.quantity = newQuantity;
        }
    })

    saveToStorage();
}

export function calculateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    })

    return cartQuantity;
}