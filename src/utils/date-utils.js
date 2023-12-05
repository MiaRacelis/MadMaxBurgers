export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getCurrentDate() {
    return new Date();
}

export function getMonthName(date) {
    return date ? MONTH_NAMES[date.getMonth()] : '';
}

export function getFullDate(date) {
    const currentDate = date || getCurrentDate();
    return `${ getMonthName(currentDate) } ${ currentDate.getDate() }, ${ currentDate.getFullYear() }`;
}

export function getCurrentDateTime() {
    const date = getCurrentDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return `${getFullDate(date)} ${strTime}`;
}