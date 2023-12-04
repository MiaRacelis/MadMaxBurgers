import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import * as formik from 'formik';
import * as yup from 'yup';

import { STORAGE_ITEMS, getArrayFromStorage, storeItems } from '../../utils/storage-utils';
import { getFullDate } from '../../utils/date-utils';

export default function Signup() {
    const { Formik } = formik;
    const [ signedUp, setSignedUp ] = useState(false);
    const navigate = useNavigate();
    const users = getArrayFromStorage(STORAGE_ITEMS.users);
    const schema = yup.object().shape({
        username: yup.string()
            .required('Enter username.')
            .min(6, 'Username should be a minimum of 6 characters.')
            .test('Unique username', 'Username already in use', username => !users
                .find(user => user.username.toLowerCase() === username.toLowerCase())),
        password: yup.string()
            .required('Enter password.')
            .min(8, 'Password should be a minimum of 8 characters.')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/,
                'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'),
        password_confirm: yup.string()
            .required('Confirm password.')
            .oneOf([yup.ref('password'), null], 'Passwords must match.'),
        first_name: yup.string().required('Enter first name.'),
        last_name: yup.string().required('Enter last name.'),
        email_address: yup.string()
            .email('Please enter a valid email.')
            .required('Enter email address.'),
        mobile_number: yup.string()
            .required('Enter mobile number.')
            .matches(/^(09|\+639)\d{9}$/, 'Please enter a valid Philippine mobile number.'),
        address: yup.string()
            .required('Enter address.')
            .min(40, 'Address is too short.')
    });
    const formValues = {
        username: '',
        password: '',
        password_confirm: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        email_address: '',
        mobile_number: '',
        address: ''
    };
    const formControls = [
        {
            type: 'text',
            name: 'username',
            label: 'Username'
        },
        {
            type: 'password',
            name: 'password',
            label: 'Password'
        },
        {
            type: 'password',
            name: 'password_confirm',
            label: 'Confirm Password'
        },
        {
            type: 'text',
            name: 'first_name',
            label: 'First Name'
        },
        {
            type: 'text',
            name: 'middle_name',
            label: 'Middle Name'
        },
        {
            type: 'text',
            name: 'last_name',
            label: 'Last Name'
        },
        {
            type: 'email',
            name: 'email_address',
            label: 'Email Address'
        },
        {
            type: 'text',
            name: 'mobile_number',
            label: 'Mobile Number'
        },
        {
            type: 'text',
            name: 'address',
            label: 'Address'
        }
    ];

    const handleSubmit = profile => {
        const maxId = users.length > 0
            ? Math.max(...users.map(user => user.id))
            : 1;
        const newUser = {...profile, id: maxId + 1, role: 'buyer', signup_date: getFullDate() };
        delete newUser.password_confirm;
        storeItems(STORAGE_ITEMS.users, [ newUser, ...users ]);
        setSignedUp(true);
        setTimeout(() => navigate('/login'), 3000);
    };

    return (<div>
        <Container>
            <Row>
                <Col></Col>
                <Col md="6">
                    <a href="/">
                        <img src="/mdmx.png" alt="Mad Max Burger Logo" style={{ width: '100px', margin: '20px 0px' }} />
                    </a>
                    { signedUp && <Alert variant="success" onClose={ () => setSignedUp(false) } dismissible>
                        <Alert.Heading>You have successfully signed up!</Alert.Heading>
                        <p>Redirecting you to login page...</p>
                    </Alert> }
                    <h2>Sign Up</h2>
                    <p>Already a customer? <a href="/login" className="text-warning">Login</a></p>
                    <Formik validationSchema={schema}
                    initialValues={formValues}
                    onSubmit={handleSubmit}>
                        { ({ handleSubmit, handleBlur, setFieldValue, values, touched, errors }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                { formControls.map((ctrl, index) => (
                                    <Form.Group key={index} className="mb-3" controlId={ctrl.name}>
                                        <FloatingLabel label={ctrl.label} className="mb-3">
                                            <Form.Control
                                            type={ctrl.type}
                                            name={ctrl.name}
                                            value={values[ctrl.name]}
                                            onBlur={handleBlur}
                                            onChange={e => setFieldValue(e.target.name, e.target.value)}
                                            isInvalid={touched[ctrl.name] && errors[ctrl.name]}
                                            isValid={touched[ctrl.name] && !errors[ctrl.name]} />
                                            <Form.Control.Feedback type="invalid">
                                                {errors[ctrl.name]}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                ))}

                                <Button type="submit" variant="warning">
                                    Submit
                                </Button>
                            </Form>
                        ) }
                    </Formik>
                </Col>
                <Col></Col>
            </Row>
            <br />
        </Container>
    </div>);
}