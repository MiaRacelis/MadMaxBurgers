import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import * as formik from 'formik';
import * as yup from 'yup';

import { STORAGE_ITEMS, getArrayFromStorage, getItem, storeItems } from '../../utils/storage-utils';
import { useState } from 'react';

export default function Profile(props) {
    const [ profile, setProfile ] = useState(getItem(STORAGE_ITEMS.user));
    const [ profileUpdated, setProfileUpdated ] = useState(false);
    const { Formik } = formik;
    const schema = yup.object().shape({
        first_name: yup.string().required('Enter first name'),
        last_name: yup.string().required('Enter last name'),
        email_address: yup.string()
            .email('Please enter a valid email')
            .required('Enter email address'),
        mobile_number: yup.string()
            .required('Enter mobile number')
            .matches(/^(09|\+639)\d{9}$/, 'Please enter a valid Philippine mobile number.'),
        address: yup.string()
            .required('Enter address')
            .min(40, 'Address is too short.')
    });
    const formControls = [
        {
            type: 'text',
            name: 'username',
            label: 'Username',
            disabled: true
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

    const handleSubmit = (profile, setSubmitting) => {
        setProfile(profile);
        storeItems(STORAGE_ITEMS.user, profile);
        storeItems(STORAGE_ITEMS.users, getArrayFromStorage(STORAGE_ITEMS.users).map(user => {
            if (user.id === profile.id)
                user = profile;
            return user;
        }));
        setProfileUpdated(true);
        setSubmitting(false);
    };

    return (<div>
        <Container>
            <Row>
                <Col md="6">
                    <h2>My Profile Information</h2>
                    <br />
                    { profileUpdated && <Alert variant="success" onClose={ () => setProfileUpdated(false) } dismissible>
                        You updated your profile!
                    </Alert> }
                    <Formik validationSchema={schema}
                    initialValues={profile}
                    onSubmit={(profile, { setSubmitting }) => handleSubmit(profile, setSubmitting)}>
                        { ({ handleSubmit, handleBlur, setFieldValue, values, touched, errors, isSubmitting, dirty }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                { formControls.map((ctrl, index) => (
                                    <Form.Group key={index} className="mb-3" controlId={ctrl.name}>
                                        <FloatingLabel label={ctrl.label} className="mb-3">
                                            <Form.Control
                                            type={ctrl.type}
                                            name={ctrl.name}
                                            disabled={ctrl.disabled}
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

                                <Button type="submit" variant="warning" disabled={isSubmitting || !dirty}>
                                    Save Changes
                                </Button>
                            </Form>
                        ) }
                    </Formik>
                </Col>
            </Row>
        </Container>
    </div>);
}