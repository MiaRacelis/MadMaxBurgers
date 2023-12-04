const REGEX_COMMA = /\B(?=(\d{3})+(?!\d))/g;

export function formatWithComma(num) {
    return num && typeof num == 'number'
        ? num.toString().replace(REGEX_COMMA, ",")
        : '0';
}

export function formatAmount(amount) {
    return amount && typeof amount == 'number'
        ? amount.toFixed(2).replace(REGEX_COMMA, ",")
        : '0.00';
}

export function formatAmountWithCurrency(amount) {
    return `PHP ${formatAmount(amount)}`;
}

