export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getCurrentDate() {
    return new Date();
}

export function getMonthName(date) {
    return date ? MONTH_NAMES[date.getMonth()] : '';
}

export function getFullDate() {
    const currentDate = new Date();
    return `${ getMonthName(currentDate) } ${ currentDate.getDate() }, ${ currentDate.getFullYear() }`;
}