import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import * as formik from 'formik';
import * as yup from 'yup';

import Card from '../../components/Card';
import './Products.css';
import { getArrayFromStorage } from '../../utils/storage-utils';
import { formatAmountWithCurrency } from '../../utils/number-utils';

const PRODUCTS_INIT_DATA = getArrayFromStorage('products');
const PRODUCT_INIT_DATA = { id: null, name: '', description: '', price: 0.00, quantity: 0 };

function ProductForm(props) {
    const { Formik } = formik;
    const schema = yup.object().shape({
        name: yup.string().required(),
        price: yup.number().required().positive()
    });

    const handleSubmit = (product) => product.id
        ? props.handleProductUpdate(product)
        : props.handleProductAdd(product);

    return (
        <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {`${ props.product.id ? 'Update' : 'Add' } Product`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={schema}
                    initialValues={props.product}
                    onSubmit={handleSubmit}>
                    {({ handleSubmit, handleBlur, setFieldValue, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="productName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={e => setFieldValue(e.target.name, e.target.value)}
                                placeholder="Enter product name"
                                isInvalid={touched.name && errors.name}
                                isValid={touched.name && !errors.name} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a product name.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="productDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={values.description}
                                onChange={e => setFieldValue(e.target.name, e.target.value)}
                                placeholder="Enter product description" />
                        </Form.Group>

                        <Form.Label>Price</Form.Label>
                        <InputGroup className="mb-3" hasValidation>
                            <InputGroup.Text>PHP</InputGroup.Text>
                            <Form.Control
                                isInvalid={touched.price && errors.price}
                                isValid={touched.price && !errors.price}
                                type="number"
                                name="price"
                                value={values.price}
                                onBlur={handleBlur}
                                onChange={e => setFieldValue(e.target.name, e.target.value)}
                                placeholder="Enter product price" />
                            <Form.Control.Feedback type="invalid">
                                Please provide price for your product.
                            </Form.Control.Feedback>
                        </InputGroup>

                        <Form.Label>Stocks</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={values.quantity}
                                onChange={e => setFieldValue(e.target.name, e.target.value)}
                                placeholder="How many stocks?" />
                        </InputGroup>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </Form> )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
}

export default function Products() {
    const [ product, setProduct ] = useState(PRODUCT_INIT_DATA);
    const [ productFormShown, setProductFormShown ] = useState(false);
    const [ productsList, setProductsList ] = useState(PRODUCTS_INIT_DATA);

    const handleCardClick = product => {
        setProduct(product);
        setProductFormShown(true);
    };

    const handleProductChange = product => setProduct(product);
    const handleProductAdd = product => {
        const productIds = productsList.map(product => parseInt(product.id));
        const maxId = Math.max(...productIds);
        product.id = maxId + 1;
        const newProducts = [product, ...productsList]
        localStorage.setItem('products', JSON.stringify(newProducts));
        setProductsList(newProducts);
        setProductFormShown(false);
    };
    const handleProductUpdate = product => {
        const productIndex = productsList.findIndex(newProduct => newProduct.id === product.id);
        productsList[productIndex] = product;
        localStorage.setItem('products', JSON.stringify(productsList));
        setProductsList(productsList);
        setProductFormShown(false);
    };

    return (<div className="mdmx-page-content">

        { productFormShown && <ProductForm
            product={product}
            show={productFormShown}
            onHide={() => setProductFormShown(false)}
            handleProductChange={handleProductChange}
            handleProductAdd={handleProductAdd}
            handleProductUpdate={handleProductUpdate} /> }

        <h1>My Products</h1>
        <div className="mdmx-products">
            { productsList.sort((p1,p2) => p2.id - p1.id).map(product => (
                <Card
                    key={product.id}
                    data={product}
                    img={product.img_name || 'fallbackburger.png'}
                    title={product.name}
                    text={product.description}
                    classes={parseInt(product.quantity) === 0 ? 'mdmx-product-unavailable' : ''}
                    footer={parseInt(product.quantity) !== 0
                        ? formatAmountWithCurrency(parseFloat(product.price))
                        : 'Unavailable'}
                    handleClick={handleCardClick} />
            ))}
        </div>
        <button className="mdmx-float" onClick={() => {
            setProduct(PRODUCT_INIT_DATA);
            setProductFormShown(true);}}>
            +
        </button>
    </div>)
}