import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import * as formik from 'formik';
import * as yup from 'yup';

const ProductForm = ({
    product,
    show,
    onHide,
    handleProductAdd,
    handleProductUpdate
}) => {
    const { Formik } = formik;
    const schema = yup.object().shape({
        name: yup.string().required(),
        price: yup.number().required().positive()
    });

    const handleSubmit = (product) => product.id
        ? handleProductUpdate(product)
        : handleProductAdd(product);
    return (<>
        <Modal
        show={show}
        onHide={onHide}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {`${ product.id ? 'Update' : 'Add' } Product`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={schema}
                    initialValues={product}
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
    </>);
};

export default ProductForm;