import { useState } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'

import { STORAGE_ITEMS, getArrayFromStorage } from '../../utils/storage-utils';
import { formatAmountWithCurrency } from '../../utils/number-utils';
import { getCurrentUser } from '../../utils/auth-utils';

const OrderSummary = () => {
    const user = getCurrentUser();
    const carts = getArrayFromStorage(STORAGE_ITEMS.carts);
    const userCart = carts.find(cart => cart.customer_id === user.id);
    const userCartItems = userCart ? Array.from(userCart.items).filter(item => item.order_quantity > 0) : [];
    const [ cartItems ] = useState(userCartItems);
    const totalOrderPrice = cartItems
        .reduce((sum, item) => sum += parseInt(item.order_quantity) * parseFloat(item.price), 0);
    return (<>
        <ListGroup style={{ clear: 'right' }} variant="flush">
            { cartItems.length === 0 && <ListGroup.Item>
                <p>
                    You currently have no items in your cart.
                </p>
            </ListGroup.Item> }
            { cartItems.map((item, index) => (
                <ListGroup.Item key={index}>
                    <Container fluid>
                        <Row>
                            <Col md="8">
                                <div className="order-product-icon"style={{
                                    backgroundImage: `url("${process.env.PUBLIC_URL}/img/${item.img_name}")`,
                                    width: '50px',
                                    height: '50px'
                                }}></div>
                                <span>{item.order_quantity} x {item.name}</span>
                            </Col>
                            <Col>
                                <span style={{ lineHeight: '3', float: 'right' }}>
                                    { formatAmountWithCurrency(parseFloat(item.price) * parseInt(item.order_quantity)) }
                                </span>
                            </Col>
                        </Row>
                    </Container>
                </ListGroup.Item>
            )) }
            <ListGroup.Item>
                <Container fluid>
                    <span style={{ float: 'right' }}>
                        <b>{formatAmountWithCurrency(totalOrderPrice)}</b>
                    </span>
                </Container>
            </ListGroup.Item>
        </ListGroup>
    </>)
};
export default OrderSummary;
