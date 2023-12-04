import { MONTH_NAMES, getCurrentDate } from "./date-utils";

const CURRENT_DATE = getCurrentDate();

export function getOrderedProductsPerMonth(orders) {
    const ordersPerMonth = orders.map(order => order.items
        .map(item => { return  {...item, date_ordered: new Date(order.order_date_time)}; }))
        .flat(1)
        .filter(item => item.date_ordered.getFullYear() === CURRENT_DATE.getFullYear());
    return ordersPerMonth.map(item => item.date_ordered.getMonth())
        .reduce((m1, m2) => { if (m1.indexOf(m2) < 0) m1.push(m2); return m1; }, [])
        .sort((m1, m2) => m1 - m2)
        .map(month => {
            const productOrders = ordersPerMonth
                .filter(item => new Date(item.date_ordered).getMonth() === month)
                .reduce((counts, item) => {
                    const productName = item.product.name;
                    counts[productName] = counts[productName]
                        ? counts[productName] + item.quantity
                        : item.quantity;
                    return counts;
                }, {});
            return { month: MONTH_NAMES[month], orders: productOrders };
        });
}

export function getCountsPerDay(items, dateKey) {
    return items.map(item => new Date(item[dateKey]))
        .filter(date => date.getFullYear() === CURRENT_DATE.getFullYear())
        .filter(date => date.getMonth() === CURRENT_DATE.getMonth())
        .map(date => date.getDate())
        .sort()
        .reduce((counts, day) => { counts[day] = counts[day]+1 || 1; return counts; }, {});
}
