import { cart, removeFromCart, calculateCartQuantity, updateCartItemQuantity, updateDeliveryOption } from '../../data/cart.js';
import { getProductById } from '../../data/products.js';
import { formatCurrencyCents } from '../utils/money.js';
import { deliveryOptions, getDeliveryOptionById } from '../../data/deliveryOptions.js';
import { getFormattedDate } from '../utils/date.js';


export function renderOrderSummary() {
    updateCartQuantity();
    let cartHtml = '';

    cart.forEach((cartItem) => {
        const product = getProductById(cartItem.productId);

        const deliveryOption = getDeliveryOptionById(cartItem.deliveryOptionId);

        cartHtml +=
            `<div class="cart-item-container js-cart-item-container-${product.id}">
            <div class="delivery-date js-delivery-date-${deliveryOption.id}">
              Delivery date: ${getFormattedDate(deliveryOption.deliveryDays)}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${product.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${product.name}
                </div>
                <div class="product-price">
                  $${formatCurrencyCents(product.priceCents)} 
                </div>

                <div class="product-quantity js-product-quantity">
                  <span >
                    Quantity: <span class="quantity-label js-quantity-label-${product.id}">${cartItem.quantity}</span>
                  </span>
                    <span class="update-quantity-link link-primary js-update-quantity" data-product-id="${product.id}">
                        Update
                    </span>
                    <input class="quantity-input js-quantity-input-${product.id} ">
                    <span class="save-quantity-link link-primary js-save-quantity-link-${product.id}">Save</span>

                    <span class="delete-quantity-link link-primary js-delete-quantity" data-product-id="${product.id}">
                        Delete
                    </span>
                </div>
              </div>

              <div class="delivery-options js-delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHtml(product.id, cartItem)}
              </div>
            </div>
        </div>`;
    });

    document.querySelector('.js-order-summary').innerHTML = cartHtml;

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

                document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
                document.querySelector(`.js-quantity-input-${productId}`).focus();


                saveNewQuantityOnClick(productId);
                saveNewQuantityOnEnter(productId);

                document.querySelector(`.js-quantity-input-${productId}`).value = '';
            });
        });


    function saveNewQuantityOnClick(productId) {
        document.querySelector(`.js-save-quantity-link-${productId}`).addEventListener('click', () => {
            const container = document.querySelector(`.js-cart-item-container-${productId}`);

            const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

            if (newQuantity > 0 && newQuantity < 1000) {
                updateCartItemQuantity(productId, newQuantity);
                document.querySelector('.js-quantity-label').innerHTML = newQuantity;
                updateCartQuantity();
            }
            container.classList.remove('is-editing-quantity');
        });
    }


    function saveNewQuantityOnEnter(productId) {
        document.body.addEventListener('keydown', (event) => {
            const container = document.querySelector(`.js-cart-item-container-${productId}`);

            if (event.key === 'Enter' && container.classList.contains('is-editing-quantity')) {
                const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

                if (newQuantity > 0 && newQuantity < 1000) {
                    updateCartItemQuantity(productId, newQuantity);
                    document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
                    updateCartQuantity();
                }
                container.classList.remove('is-editing-quantity');
            }
        });
    }

    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                updateDeliveryOption(element.dataset.productId, element.dataset.deliveryOptionId);
                renderOrderSummary();
            })
        });
}





function updateCartQuantity() {
    document.querySelector('.js-items-counter-link').innerHTML = `${calculateCartQuantity()} items`;
}


function deliveryOptionsHtml(productId, cartItem) {
    let deliveryOptionHtml = ''

    deliveryOptions.forEach((deliveryOption) => {
        const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrencyCents(deliveryOption.priceCents)} -`

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

        deliveryOptionHtml +=
            `<div class="delivery-option js-delivery-option" data-product-id="${productId}" data-delivery-option-id="${deliveryOption.id}">
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
