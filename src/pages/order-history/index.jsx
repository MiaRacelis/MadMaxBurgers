import Container from 'react-bootstrap/Container';

import Table from '../../components/Table';
import { formatWithComma, formatAmountWithCurrency } from '../../utils/number-utils';
import { STORAGE_ITEMS, getArrayFromStorage, getItem } from '../../utils/storage-utils';

export default function OrderHistory() {
    const isAuthenticated = getItem(STORAGE_ITEMS.isAuth) || false;
    const user = getItem(STORAGE_ITEMS.user) || null;
    const isLoggedIn = user !== null && isAuthenticated;
    const userOrders = !isLoggedIn ? [] : getArrayFromStorage(STORAGE_ITEMS.orders)
        .filter(order => order.customer.id === user.id)
        .map(order => {
            order.items.forEach(item => item.totalProductPrice = parseFloat(item.product.price) * item.quantity);
            let totalOrderPrice = order.items
                .reduce((total, item) => total += item.totalProductPrice, 0);
            order.total_order_price = formatAmountWithCurrency(totalOrderPrice);
            let totalOrderItems = order.items
                .reduce((total, item) => total += parseInt(item.quantity), 0);
            order.total_items = formatWithComma(totalOrderItems);
            return order;
        }).sort((order1, order2) => new Date(order2.order_date_time) - new Date(order1.order_date_time));
    const fields = [
        {
            key: 'id',
            text: 'Order #'
        },
        {
            key: 'total_order_price',
            text: 'Total Price'
        },
        {
            key: 'total_items',
            text: 'Total Items'
        },
        {
            key: 'order_date_time',
            text: 'Order Placed At'
        },
        {
            key: 'actions',
            text: 'Actions'
        }
    ];
    const tableActions = [
        {
            text: 'View Details',
            classes: 'btn btn-sm btn-primary',
            handleClick: order => {
                console.log(order)
                // setOrderShown(true);
                // setOrderDetails(order);
            }
        }
    ];
    return (<>
        <Container>
            <h2>Order History</h2>
            <br />
            <Table fields={fields} data={userOrders} actions={tableActions} />
        </Container>
    </>);
}