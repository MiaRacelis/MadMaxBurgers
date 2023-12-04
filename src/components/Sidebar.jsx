import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function Sidebar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [ showNav, setShowNav ] = useState(false);
  const toggleNav = () => setShowNav(!showNav);
  return (<>
      { <Navbar expand="false" className="mdmx-warning mb-3">
        <Container fluid>
          <Navbar.Brand href="#">
            {props.brand && props.brand.logo && <img
              src={props.brand.logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              style={{ margin: '0 30px' }}
              alt="Sidebar Logo"
            />}
            { props.brand.title }
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="mdmxb-navbar" onClick={toggleNav} />
          <Navbar.Offcanvas
            id="mdmxb-navbar"
            placement="end"
            show={showNav}
            onHide={toggleNav}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="mdmxb-navbar-title">
                { props.brand.title }
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                { props.links.map((link, index) => (
                    <Nav.Link key={index}
                    onClick={() => { navigate(link.path); toggleNav(); }}
                    className={`justify-content-end flex-grow-1 pe-3 ${location.pathname === link.path ? 'nav-active' : ''}`}>
                      {link.text}
                    </Nav.Link>
                ))}
              </Nav>
              <hr/>
              { props.buttons.map((btn, index) => (
                <Button key={index} variant={`outline-${btn.color}`} onClick={ () => btn.handleClick() }>{btn.text}</Button>
              )) }
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar> }
  </>);
}