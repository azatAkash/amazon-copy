import { cart, calculateCartQuantity } from '../../data/cart.js';
import { products, getProductById } from '../../data/products.js';
import { formatCurrencyCents } from '../utils/money.js';
import { getDeliveryOptionById } from '../../data/deliveryOptions.js';

export function renderPaymentSummary() {
    let totalItemsPriceCents = 0;
    let totalDeliveryPriceCents = 0;

    

    cart.forEach((cartItem) => {
        totalItemsPriceCents += cartItem.quantity * getProductById(cartItem.productId).priceCents;

        totalDeliveryPriceCents += getDeliveryOptionById(cartItem.deliveryOptionId).priceCents;
    });

    const totalBeforeTaxCents = totalItemsPriceCents + totalDeliveryPriceCents;
    let taxRate = 10;
    const estimatedTaxCents = totalBeforeTaxCents / taxRate;
    const orderTotalCents = estimatedTaxCents + totalBeforeTaxCents;

    const paymentSummaryHtml = `
        <div class="payment-summary-title">Order Summary</div>

        <div class="payment-summary-row">
            <div class="js-items-count">
                Items (${calculateCartQuantity()}):
            </div>
            <div class="payment-summary-money js-total-items-price">
                $${formatCurrencyCents(totalItemsPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money js-total-delivery-price">
                $${formatCurrencyCents(totalDeliveryPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money js-total-before-tax">
                $${formatCurrencyCents(totalBeforeTaxCents)}
            </div>
        </div>

        <div class="payment-summary-row">
            <div class="js-tax-rate">
                Estimated tax ($${taxRate}%):
            </div>
            <div class="payment-summary-money js-estimated-tax">
                $${formatCurrencyCents(estimatedTaxCents)}
            </div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money js-order-total">
                $${formatCurrencyCents(orderTotalCents)}
            </div>
        </div>

        <button class="place-order-button button-primary">
            Place your order
        </button>
    `;


    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHtml;
}


