export let cart = JSON.parse(localStorage.getItem('cart')) || [
    {
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2
    },
    {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1
    },
    {
        productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
        quantity: 1
    }
];

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    let matchingItem;
    const selectedQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    })

    if (matchingItem) {
        matchingItem.quantity += selectedQuantity;
    } else {
        cart.push({
            productId,
            quantity: selectedQuantity,
        })
    }

    saveToStorage();
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




export function updateCartItemQuantity(productId, newQuantity){
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            cartItem.quantity = newQuantity;
        }
    })

    saveToStorage();
}

export function calculateCartQuantity(){
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    })
    
    return cartQuantity;
}