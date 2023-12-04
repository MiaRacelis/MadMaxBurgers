import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import * as formik from 'formik';
import * as yup from 'yup';

import { STORAGE_ITEMS, getArrayFromStorage, getItem, storeItems } from '../../utils/storage-utils';

let users = getArrayFromStorage(STORAGE_ITEMS.users);
if (users.length === 0) {
    const tmpUsers = require('../../assets/users.json');
    users = tmpUsers;
    storeItems(STORAGE_ITEMS.users, tmpUsers);
}

export default function Login() {
    const navigate = useNavigate();
    const [ loginErrorShown, setLoginErrorShown ] = useState(false);
    const { Formik } = formik;
    const schema = yup.object().shape({
        username: yup.string().required('Enter username'),
        password: yup.string().required('Enter password'),
    });

    const handleSubmit = (values) => {
        const user = getArrayFromStorage(STORAGE_ITEMS.users)
            .find(user => user.username === values.username && user.password === values.password);
        if (user) {
            storeItems(STORAGE_ITEMS.user, user);
            storeItems(STORAGE_ITEMS.isAuth, true);
            navigate('/');
        } else {
            setLoginErrorShown(true);
        }
    };

    return (<>
        <Container>
            <Row>
                <Col></Col>
                <Col lg="5" md="6">
                    <Row className="justify-content-center text-center">
                        <img src="/mdmx.png"
                        alt="Mad Max Burger Logo"
                        onClick={ () => navigate('/') }
                        style={{ width: '100px', margin: '80px 15px 30px', cursor: 'pointer' }} />
                        <h1 className="mb-4">Login</h1>
                    </Row>
                    { loginErrorShown && <Alert variant="danger" onClose={() => setLoginErrorShown(false)} dismissible>
                        You've entered an Username or Password.
                    </Alert> }
                    <Formik validationSchema={schema}
                    initialValues={{ username: '', password: '' }}
                    onSubmit={handleSubmit}>
                        { ({ handleSubmit, handleBlur, setFieldValue, values, touched, errors }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="username">
                                    <FloatingLabel label="Username" className="mb-3">
                                        <Form.Control
                                        type="text"
                                        name="username"
                                        value={values.username}
                                        onBlur={handleBlur}
                                        onChange={e => setFieldValue(e.target.name, e.target.value)}
                                        isInvalid={touched.username && errors.username}
                                        isValid={touched.username && !errors.username} />
                                        <Form.Control.Feedback type="invalid">
                                            { errors.username }
                                        </Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
            
                                <Form.Group className="mb-3" controlId="password">
                                    <FloatingLabel label="Password" className="mb-3">
                                        <Form.Control
                                        type="password"
                                        name="password"
                                        value={values.password}
                                        onBlur={handleBlur}
                                        onChange={e => setFieldValue(e.target.name, e.target.value)}
                                        isInvalid={touched.password && errors.password}
                                        isValid={touched.password && !errors.password} />
                                        <Form.Control.Feedback type="invalid">
                                            { errors.password }
                                        </Form.Control.Feedback>
                                    </FloatingLabel>
                                </Form.Group>
            
                                <Stack direction="horizontal" gap={3}>
                                    <Button variant="warning" type="submit">Login</Button>
                                    <div className="vr" />
                                    <span>New customer? <a onClick={ () => navigate('/sign-up') } className="text-warning">Sign up</a></span>
                                </Stack>
                            </Form>
                        ) }
                    </Formik>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    </>);
}
