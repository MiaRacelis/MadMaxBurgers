import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import './Orders.css';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import { formatWithComma, formatAmountWithCurrency } from '../../utils/number-utils';
import { STORAGE_ITEMS, getArrayFromStorage } from '../../utils/storage-utils';

const FINAL_STATUSES = ['delivered', 'cancelled'];
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

function OrderDetails(props) {
    const [details, setDetails] = useState(props.details);
    useEffect(() => setDetails(props.details), [props.details]);

    const handleChangeStatus = status => {
        setDetails({...details, status: status.text});
        props.onChangeStatus(status);
    };
    return (
        <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    { `Order #${details.id}` }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup variant="flush">
                    <ListGroup.Item><b>Name</b>: {details.customer_name}</ListGroup.Item>
                    <ListGroup.Item><b>Contact No.</b>: {details.customer.mobile_number}</ListGroup.Item>
                    <ListGroup.Item><b>Email</b>: {details.customer.email_address}</ListGroup.Item>
                    <ListGroup.Item><b>Delivery address</b>: {details.customer.address}</ListGroup.Item>
                    <ListGroup.Item><b>Delivery instructions</b>: {details.delivery_instructions || 'N/A'}</ListGroup.Item>
                    <ListGroup.Item><b>Date ordered</b>: {details.order_date_time}</ListGroup.Item>
                    <ListGroup.Item><b>Mode of payment</b>: {details.payment_mode || 'N/A'}</ListGroup.Item>
                    { details.notes && <ListGroup.Item><b>Notes to seller</b>: {details.notes}</ListGroup.Item> }
                    { details.status === 'cancelled' && details.cancel_reason && <ListGroup.Item>
                        <b>Reason for cancellation</b>: {details.cancel_reason}
                    </ListGroup.Item> }
                    <ListGroup.Item><b>Orders</b>:</ListGroup.Item>
                    { details.items.map((item, index) => (
                        <ListGroup.Item key={index}>
                            <div className="order-product-icon" style={{ backgroundImage: `url("img/${item.product.img_name}")` }}></div>
                            <span>{item.quantity} x {item.product.name}</span>
                            <span className="order-product-price">{ formatAmountWithCurrency(item.totalProductPrice) }</span>
                        </ListGroup.Item>
                    )) }
                    <ListGroup.Item>
                        <span className="order-product-price"><b>{ details.total_order_price }</b></span>
                    </ListGroup.Item>
                </ListGroup>
                <br/>
            </Modal.Body>
            <Modal.Footer>
                <DropdownButton
                disabled={FINAL_STATUSES.includes(details.status)}
                variant={getContextualClassByStatus(details.status)}
                title={details.status.toUpperCase()}>
                    { orderStatuses.map((status, index) => (
                        <Dropdown.Item
                        key={index}
                        onClick={() => handleChangeStatus(status)}>
                            {status.text.toUpperCase()}
                        </Dropdown.Item>
                    )) }
                </DropdownButton>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default function Orders() {
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
                    details={orderDetails}
                    onChangeStatus={status => handleChangeStatus(status)}
                    show={orderShown}
                    onHide={() => setOrderShown(false)} /> }
                <Table
                fields={fields}
                data={orderList.map(mapOrders).sort(sortOrdersByDate)}
                actions={tableActions} />
            </Row>
        </Container>
    </>);
}