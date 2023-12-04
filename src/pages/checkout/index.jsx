import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export default function Checkout() {
    const navigate = useNavigate();
    return (<div>
        <Container>
            <h2>Checkout</h2>
            <br />
            <Button variant="outline-warning" onClick={ () => navigate('/cart')}>Back to Cart</Button>
        </Container>
    </div>);
}