import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import * as formik from 'formik';
import * as yup from 'yup';

import { STORAGE_ITEMS, getArrayFromStorage, getItem, storeItems } from '../../utils/storage-utils';

const isAuthenticated = getItem(STORAGE_ITEMS.isAuth) || false;
const user = getItem(STORAGE_ITEMS.user) || null;
const isLoggedIn = user !== null && isAuthenticated;

let users = getArrayFromStorage(STORAGE_ITEMS.users);
if (users.length === 0) {
    const tmpUsers = require('../../assets/users.json');
    users = tmpUsers;
    storeItems(STORAGE_ITEMS.users, tmpUsers);
}

export default function Login() {
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
            window.location.pathname = '/';
        } else {
            setLoginErrorShown(true);
        }
    };

    return (isLoggedIn ? <Navigate to={'/'} replace /> : <div className="mdmx-page-content">
        <div style={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', }}>
            <a href="/">
                <img src="/mdmx.png" alt="Mad Max Burger Logo" style={{ width: '100px', margin: '80px 15px 30px' }} />
            </a>
            <h1>Login</h1>
            <div style={{ width: '40%' }}>
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
                                <span>New customer? <a href="/sign-up" className="text-warning">Sign up</a></span>
                            </Stack>
                        </Form>
                    ) }
                </Formik>
            </div>
        </div>
    </div>);
}
