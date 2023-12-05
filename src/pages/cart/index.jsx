import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import OrderSummary from '../orders/OrderSummary';
import { STORAGE_ITEMS, getArrayFromStorage } from '../../utils/storage-utils';
import { getCurrentUser } from '../../utils/auth-utils';

export default function Cart() {
    const user = getCurrentUser();
    const navigate = useNavigate();
    const carts = getArrayFromStorage(STORAGE_ITEMS.carts);
    const userCart = carts.find(cart => cart.customer_id === user.id);
    const userCartItems = userCart ? Array.from(userCart.items).filter(item => item.order_quantity > 0) : [];
    const [ cartItems ] = useState(userCartItems);

    return (<>
        <Container>
            <Row>
                <Col></Col>
                <Col sm="12" lg="8">
                    <Row style={{ margin: '10px 15px' }}>
                        <Col><h2>My Cart</h2></Col>
                        <Col>
                            <Button variant="outline-secondary"
                            style={{ float: 'right' }}
                            onClick={() => navigate('/')}>Add items</Button>
                        </Col>
                    </Row>
                    <OrderSummary />
                    <Button disabled={cartItems.length === 0}
                    variant="warning"
                    style={{ float: 'right', marginTop: '25px', marginRight: '15px' }}
                    onClick={() => navigate('/checkout')}>CHECKOUT</Button>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    </>);
}