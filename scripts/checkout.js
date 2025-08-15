import { cart, removeFromCart, calculateCartQuantity, updateCartItemQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrencyCents } from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';


updateCartQuantity();
renderCartItems();




function renderCartItems() {
    let cartHtml = '';

    cart.forEach((cartItem) => {
        let matchingItem;

        products.forEach((product) => {
            if (product.id === cartItem.productId) {
                matchingItem = product;
            }
        });


        let deliveryOption;

        deliveryOptions.forEach((option) => {
            if (option.id === cartItem.deliveryOptionId) {
                deliveryOption = option;
            }
        });

        cartHtml +=
            `<div class="cart-item-container js-cart-item-container-${matchingItem.id}">
            <div class="delivery-date">
              Delivery date: ${getFormattedDate(deliveryOption.deliveryDays)}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingItem.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingItem.name}
                </div>
                <div class="product-price">
                  $${formatCurrencyCents(matchingItem.priceCents)} 
                </div>
                <div class="product-quantity js-product-quantity">
                  <span >
                    Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
                  </span>
                    <span class="update-quantity-link link-primary js-update-quantity" data-product-id="${matchingItem.id}">
                        Update
                    </span>
                    <input class="quantity-input js-quantity-input">
                    <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingItem.id}">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-quantity" data-product-id="${matchingItem.id}">
                        Delete
                    </span>
                </div>
              </div>

              <div class="delivery-options js-delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>

                ${deliveryOptionsHtml(matchingItem.id, cartItem)}
                
              </div>
            </div>
        </div>`;

        const selectedDeliveryElement = document.querySelector(`input[name="delivery-option-${cartItem.productId}"]:checked`);

        console.log(selectedDeliveryElement);
    });


    document.querySelector('.js-order-summary').innerHTML = cartHtml;
}

function deliveryOptionsHtml(productId, cartItem) {
    
    let deliveryOptionHtml = ''

    deliveryOptions.forEach((deliveryOption) => {
        
        const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrencyCents(deliveryOption.priceCents)} -`

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        deliveryOptionHtml +=
            `<div class="delivery-option">
                <input type="radio" class="delivery-option-input"
                    name="delivery-option-${productId}"
                    ${isChecked ? 'checked' : ''}
                    >
                <div>
                    <div class="delivery-option-date">
                        ${getFormattedDate(deliveryOption.deliveryDays)}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} Shipping
                    </div>
                </div>
            </div>`


    });
    return deliveryOptionHtml;
}

function getFormattedDate(daysToAdd){
    const deliveryDate = dayjs();
    return deliveryDate.add(daysToAdd, 'days').format('dddd, MMMM D');
}

function updateCartQuantity() {
    document.querySelector('.js-items-counter-link').innerHTML = `${calculateCartQuantity()} items`;
}



document.querySelectorAll('.js-delete-quantity')
    .forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;

            removeFromCart(productId);

            document.querySelector(`.js-cart-item-container-${productId}`).remove();
            updateCartQuantity();
        });
    });


document.querySelectorAll('.js-update-quantity')
    .forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;

            document.querySelector('.cart-item-container').classList.add('is-editing-quantity');
            document.querySelector('.js-quantity-input').focus();

            saveNewQuantityOnClick(productId);
            saveNewQuantityOnEnter(productId);

            document.querySelector('.js-quantity-input').value = '';
        });
    });


function saveNewQuantityOnClick(productId) {
    document.querySelector('.js-save-quantity-link').addEventListener('click', () => {

        const newQuantity = Number(document.querySelector('.js-quantity-input').value);

        if (newQuantity > 0 && newQuantity < 1000) {
            updateCartItemQuantity(productId, newQuantity);
            document.querySelector('.js-quantity-input').value = 0;
            document.querySelector('.js-quantity-label').innerHTML = newQuantity;
            updateCartQuantity();
        }
        document.querySelector('.cart-item-container').classList.remove('is-editing-quantity');
    });
}


function saveNewQuantityOnEnter(productId) {
    document.body.addEventListener('keydown', (event) => {
        const container = document.querySelector('.cart-item-container');


        if (event.key === 'Enter' && container.classList.contains('is-editing-quantity')) {
            const newQuantity = Number(document.querySelector('.js-quantity-input').value);

            if (newQuantity > 0 && newQuantity < 1000) {
                updateCartItemQuantity(productId, newQuantity);

                document.querySelector('.js-quantity-label').innerHTML = newQuantity;
                updateCartQuantity();
            }
            container.classList.remove('is-editing-quantity');
        }

    });
}