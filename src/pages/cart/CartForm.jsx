import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Col, Container,
    Form,
    InputGroup,
    Modal,
    Row 
} from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import { isLoggedIn } from '../../utils/auth-utils';

const CartForm = ({
    product,
    cart,
    show,
    onHide,
    addToCart,
    updateCart
}) => {
    const navigate = useNavigate();
    const { Formik } = formik;
    const cartItem = cart.items
        .find(item => item.id === product.id && item.order_quantity > 0);
    const initOrderQuantity = isLoggedIn() && cartItem ? cartItem.order_quantity : 0;
    const [ orderQuantity, setOrderQuantity ] = useState(initOrderQuantity);
    const [ stocks, setStocks ] = useState(product.quantity);
    const schema = yup.object().shape({
        orderQuantity: yup.number('Please input a valid number.')
            .required()
            .min(0)
            .max(parseInt(product.quantity), 'Not enough stock!')
    });

    return (<>
        <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {product.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col>
                            <div className="order-product-icon" style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/img/${product.img_name}")`, width: '100%', height: '140px' }}></div>
                        </Col>
                        <Col xs="8">
                            <p>{product.description}</p>
                            <Formik
                                validationSchema={schema}
                                initialValues={{orderQuantity: orderQuantity}}
                                onSubmit={() => cartItem
                                    ? updateCart({...product, order_quantity: orderQuantity})
                                    : addToCart({...product, order_quantity: orderQuantity})}>
                                {({ handleSubmit, handleBlur, setFieldValue, touched, errors }) => (
                                    <Form noValidate onSubmit={handleSubmit}>
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                                type="number"
                                                name="orderQuantity"
                                                value={orderQuantity}
                                                disabled={!isLoggedIn()}
                                                onBlur={handleBlur}
                                                onChange={e => {
                                                    const availableStock = product.quantity;
                                                    let newValue = e.target.value;
                                                    setOrderQuantity(newValue);
                                                    setFieldValue(e.target.name, newValue);
                                                    newValue = newValue ? parseInt(newValue) : 0;
                                                    let newStockValue = newValue > 0 && newValue <= availableStock
                                                        ? availableStock - newValue
                                                        : (newValue > availableStock ? 0 : availableStock);
                                                    setStocks(newStockValue);
                                                }}
                                                isInvalid={touched.orderQuantity && errors.orderQuantity}
                                                isValid={touched.orderQuantity && !errors.orderQuantity} />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.orderQuantity}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                        <div>
                                            <b>Stocks</b>: <span className={ `text-${stocks > 10 ? 'success' : 'danger'}` }>{`${stocks} ${stocks <= 10 && stocks > 0 ? 'items left' : ''}`}</span>
                                        </div>
                                        { !isLoggedIn() && <Button variant="warning"
                                        style={{ float: 'right' }}
                                        onClick={() => navigate('/login')}>
                                           Login to order
                                        </Button> }
                                        { isLoggedIn() && <Button type="submit"
                                        variant="warning"
                                        disabled={orderQuantity < 1 && !cartItem}
                                        style={{ float: 'right' }}>
                                            {`${cartItem ? 'Update' : 'Add to'} Cart`}
                                        </Button> }
                                    </Form>
                                )}
                            </Formik>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    </>);
};

export default CartForm;