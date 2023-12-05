import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Alert from 'react-bootstrap/Alert';
import OrderSummary from '../orders/OrderSummary';

import { getCurrentUser } from '../../utils/auth-utils';
import { mapToOrder, clearCartItems } from '../../utils/order-utils';
import { STORAGE_ITEMS, getArrayFromStorage, storeItems } from '../../utils/storage-utils';

export default function Checkout() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [ deliveryInstructions, setDeliveryInstructions ] = useState('');
    const [ isOrderPlaced, setOrderPlaced ] = useState(false);
    const placeOrder = () => {
        const orderPlaced = mapToOrder(user, deliveryInstructions);
        const products = getArrayFromStorage(STORAGE_ITEMS.products);
        const orders = getArrayFromStorage(STORAGE_ITEMS.orders);
        orderPlaced.items.forEach(item => products.forEach(product => {
            if (product.id === item.product.id)
                product.quantity -= item.quantity;
        }));
        storeItems(STORAGE_ITEMS.products, products);
        storeItems(STORAGE_ITEMS.orders, [orderPlaced, ...orders]);
        clearCartItems(user.id);
        setOrderPlaced(true);
        setTimeout(() => navigate('/order-history'), 2000);
    };
    return (<div>
        <Container>
            <Row className="mb-3">
                <Col><h2 className="mb-3 c-right">Checkout</h2></Col>
                <Col><Button variant="outline-warning"
                    className="mb-3 f-right"
                    onClick={ () => navigate('/cart')}>Back to Cart</Button>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    { isOrderPlaced && <Alert variant="success"
                    className="mb-3"
                    onClose={ () => setOrderPlaced(false) } dismissible>
                        <Alert.Heading>You have successfully placed your order!</Alert.Heading>
                        <p>Redirecting you to order history for tracking...</p>
                    </Alert> }
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Delivery Information</Accordion.Header>
                            <Accordion.Body>
                                <div className="mb-3">
                                    <b>Name</b>: {`${user.first_name} ${user.middle_name} ${user.last_name}`} <br/>
                                    <b>Contact Number</b>: {user.mobile_number} <br/>
                                    <b>Address</b>: {user.address}
                                </div>
                                <Form>
                                    <Form.Group>
                                        <FloatingLabel label="Delivery Instructions">
                                            <Form.Control as="textarea"
                                            value={deliveryInstructions}
                                            onChange={e => setDeliveryInstructions(e.target.value)} />
                                        </FloatingLabel>
                                    </Form.Group>
                                </Form>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
            <Row className="mb-5"><Col><OrderSummary /></Col></Row>
            <Row>
                <Col><Button variant="warning"
                className="f-right"
                onClick={placeOrder}>Place Order</Button></Col>
            </Row>
        </Container>
    </div>);
}
