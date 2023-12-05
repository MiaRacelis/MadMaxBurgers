import { useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import Table from '../../components/Table';
import Badge from '../../components/Badge';
import OrderDetails from './OrderDetails';
import './Orders.css';
import { getCurrentUser } from '../../utils/auth-utils';
import { formatWithComma, formatAmountWithCurrency } from '../../utils/number-utils';
import { STORAGE_ITEMS, getArrayFromStorage } from '../../utils/storage-utils';

const orderStatuses = require('../../assets/order-statuses.json');

const getContextualClassByStatus = status => {
    status = status && status.toLowerCase();
    const orderStatus = orderStatuses.find(orderStatus => orderStatus.text.toLowerCase() === status);
    return orderStatus ? orderStatus.contextual_class : 'secondary';
};

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
        key: 'customer_name',
        text: 'Customer'
    },
    {
        key: 'order_date_time',
        text: 'Order Placed At'
    },
    {
        key: 'order_status',
        text: 'Status'
    },
    {
        key: 'actions',
        text: 'Actions'
    }
];

export default function Orders() {
    let user = getCurrentUser();
    const getOrders = () => getArrayFromStorage(STORAGE_ITEMS.orders);
    const [ orderList, setOrderList ] = useState(getOrders());
    const [ orderDetails, setOrderDetails ] = useState(null);
    const [ orderSearch, setOrderSearch ] = useState('');
    const [ orderShown, setOrderShown ] = useState(false);
    const mapOrders = order => {
        let customer = order.customer;
        order.customer_name = `${customer.first_name} ${customer.middle_name} ${customer.last_name}`;
        order.items.forEach(item => item.totalProductPrice = parseFloat(item.product.price) * item.quantity);
        let totalOrderPrice = order.items
            .reduce((total, item) => total += item.totalProductPrice, 0);
        order.total_order_price = formatAmountWithCurrency(totalOrderPrice);
        let totalOrderItems = order.items
            .reduce((total, item) => total += parseInt(item.quantity), 0);
        order.total_items = formatWithComma(totalOrderItems);
        order.order_status = <Badge type={getContextualClassByStatus(order.status)} text={order.status} />
        return order;
    };
    const sortOrdersByDate = (order1, order2) => new Date(order2.order_date_time) - new Date(order1.order_date_time);
    
    const tableActions = [
        {
            text: 'View Details',
            classes: 'btn btn-sm btn-primary',
            handleClick: order => {
                user = getCurrentUser();
                setOrderShown(true);
                setOrderDetails(order);
            }
        }
    ];

    const handleOrderSearch = event => {
        const searchValue = event.target.value;
        const filteredOrders = searchValue
            ? orderList.filter(o => o.id.toLowerCase().includes(searchValue.toLowerCase()))
            : getOrders();
        setOrderSearch(searchValue);
        setOrderList(filteredOrders.map(mapOrders).sort(sortOrdersByDate));
    };

    const handleChangeStatus = status => {
        let orderListToUpdate = [...orderList];
        orderListToUpdate.filter(order => orderDetails.id === order.id)
            .forEach(order => order.status = status.text);
        orderListToUpdate.forEach(order => delete order.order_status);
        localStorage.setItem('orders', JSON.stringify(orderListToUpdate));
        setOrderList(orderListToUpdate);
        setOrderShown(false);
    };

    return (<>
        <Container>
            <Row className="mb-3">
                <Col><h2>Orders</h2></Col>
                <Col lg="4" md="6" className="justify-content-end">
                    <Form className="d-flex">
                        <Form.Control type="text" value={orderSearch} onChange={handleOrderSearch} placeholder="Search" className="me-2" />
                    </Form>
                </Col>
            </Row>
            <Row>
                { orderDetails && <OrderDetails
                    currentUser={user}
                    details={orderDetails}
                    handleChangeStatus={status => handleChangeStatus(status)}
                    show={orderShown}
                    onHide={() => setOrderShown(false)}
                    getContextualClassByStatus={getContextualClassByStatus} /> }
                <Table
                fields={fields}
                data={orderList.map(mapOrders).sort(sortOrdersByDate)}
                actions={tableActions} />
            </Row>
        </Container>
    </>);
}
