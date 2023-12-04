import { Outlet, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Sidebar from './components/Sidebar';
import { isLoggedIn, getCurrentUser, removeAuth } from './utils/auth-utils';

export default function App() {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const pages = require('./assets/pages.json');
    const sidebarLinks = user ? pages.filter(page => isLoggedIn()
        && Array.from(page.allowed_roles).includes(user.role)
        && page.shown_in_nav) : [];
    const logout = () => {
        removeAuth();
        navigate('/login')
    };
    return (<>
        { isLoggedIn() && <Sidebar brand={{ title: user ? `Welcome ${user.first_name}!` : '', logo: 'mdmx.png'  }}
        links={sidebarLinks}
        buttons={[{ text: 'Logout', handleClick: () => logout(), color: 'warning' }]} /> }
        { !isLoggedIn() && <Navbar className="mdmx-warning mb-3">
            <Container fluid>
                <Navbar.Brand href="#">
                    <img src="mdmx.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    style={{ margin: '0 30px' }}
                    alt="MadMax Burger Logo"/>
                    MadMax Burger
                </Navbar.Brand>
                <Nav onSelect={(selectedKey) => navigate(selectedKey)}>
                    <Nav.Item>
                        <Nav.Link eventKey="/login">Login</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar> }
        <Container fluid>
            <Row>
                <Col>
                    <Outlet />
                </Col>
            </Row>
        </Container>
    </>);
}