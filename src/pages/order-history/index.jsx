import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import Table from '../../components/Table';
import OrderDetails from '../orders/OrderDetails';
import { getCurrentUser, isLoggedIn } from '../../utils/auth-utils';
import { formatWithComma, formatAmountWithCurrency } from '../../utils/number-utils';
import { STORAGE_ITEMS, getArrayFromStorage } from '../../utils/storage-utils';

export default function OrderHistory() {
    const navigate = useNavigate();
    const tmpOrderStatuses = Array.from(require('../../assets/order-statuses.json'))
        .map(status => status.text);
    const orderStatuses = ['order placed', ...tmpOrderStatuses];
    let user = getCurrentUser();
    const getUserOrders = () => !isLoggedIn() ? [] : getArrayFromStorage(STORAGE_ITEMS.orders)
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
    const [ userOrders ] = useState(getUserOrders());
    const [ statusFilter, setStatusFilter ] = useState('order placed');
    const [ orderShown, setOrderShown ] = useState(false);
    const [ orderDetails, setOrderDetails ] = useState(null);
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
                user = getCurrentUser();
                setOrderShown(true);
                setOrderDetails(order);
            }
        }
    ];
    return (<>
        <Container fluid>
            { orderDetails && <OrderDetails
            currentUser={user}
            details={orderDetails}
            show={orderShown}
            onHide={() => setOrderShown(false)} /> }
            <Row className="mb-3">
                <Col sm="6"><h2>Order History</h2></Col>
                <Col sm="6"><Button variant="warning"
                className="f-right"
                onClick={() => navigate('/')}>Add Order</Button></Col>
            </Row>
            <Row>
                <Col>
                    <Nav fill variant="tabs" defaultActiveKey="order placed" onSelect={status => {
                        getUserOrders();
                        setStatusFilter(status);
                    }}>
                        { orderStatuses.map((status, index) => (
                            <Nav.Item key={index}>
                                <Nav.Link eventKey={status}>{status.toUpperCase()}</Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                    <Table fields={fields}
                    data={userOrders.filter(order => order.status === statusFilter)}
                    emptyMessage={`No orders ${statusFilter}.`}
                    actions={tableActions} />`
                </Col>
            </Row>
        </Container>
    </>);
}