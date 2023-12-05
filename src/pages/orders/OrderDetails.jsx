import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import './Orders.css';
import { formatAmountWithCurrency } from '../../utils/number-utils';

const OrderDetails = ({
    details,
    handleChangeStatus,
    show,
    onHide,
    getContextualClassByStatus
}) => {
    const FINAL_STATUSES = ['delivered', 'cancelled'];
    const orderStatuses = require('../../assets/order-statuses.json');

    return (
        <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
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
                            <div className="order-product-icon" style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/img/${item.product.img_name}")` }}></div>
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
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default OrderDetails;
