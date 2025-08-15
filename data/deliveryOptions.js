import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

function getFormattedDate(date) {
    return date.format('dddd, MMMM D');
}


function isWeekend(date){
    if (date.format('dddd') === 'Saturday' || date.format('dddd') === 'Sunday'){
        return true;
    }
    return false;
}

export function getDeliveryOptionById(deliveryOptionId) {
    let deliveryOption;

    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
        }
    });

    return deliveryOption;
}

export function calculateDeliveryDate(deliveryOption) {
    let date = dayjs();
    let daysToAdd = deliveryOption.deliveryDays;

    while (daysToAdd) {
        date = date.add(1, 'days');
        if(!isWeekend(date)){
            daysToAdd--;
        }
    }
    return getFormattedDate(date);
}

export const deliveryOptions = [
    {
        id: '1',
        deliveryDays: 7,
        priceCents: 0
    },
    {
        id: '2',
        deliveryDays: 3,
        priceCents: 499
    },
    {
        id: '3',
        deliveryDays: 1,
        priceCents: 999
    }
];

