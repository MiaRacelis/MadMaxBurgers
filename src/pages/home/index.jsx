import { useState } from 'react';
import {
    Col,
    Container,
    Form,
    Row
} from 'react-bootstrap';

import { STORAGE_ITEMS, getArrayFromStorage, storeItems } from '../../utils/storage-utils';
import { formatAmountWithCurrency } from '../../utils/number-utils';
import { getCurrentUser, isLoggedIn } from '../../utils/auth-utils';
import Card from '../../components/Card'
import CartForm from '../cart/CartForm';
import '../products/Products.css';

export default function Home() {
    const user = getCurrentUser();
    const PRODUCT_INIT_DATA = { id: null, name: '', description: '', price: 0.00, quantity: 0 };
    const CART_INIT_DATA = { customer_id: isLoggedIn() ? user.id : null, items: [] };
    const getProducts = () => getArrayFromStorage(STORAGE_ITEMS.products);
    
    const [ product, setProduct ] = useState(PRODUCT_INIT_DATA);
    const [ productFormShown, setProductFormShown ] = useState(false);
    const [ productSearch, setProductSearch ] = useState('');
    const [ productsList, setProductsList ] = useState(getProducts());
    const [ cart, setCart ] = useState(CART_INIT_DATA);

    const getCart = () => {
        const carts = getArrayFromStorage(STORAGE_ITEMS.carts)
        if (!isLoggedIn()) return CART_INIT_DATA;
        const userCart = carts.find(cart => cart.customer_id === user.id);
        return userCart || CART_INIT_DATA;
    };
    const handleProductSearch = event => {
        const searchValue = event.target.value;
        const filteredProducts = searchValue
            ? productsList.filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase()))
            : getProducts();
        setProductSearch(searchValue);
        setProductsList(filteredProducts);
    };

    const handleCardClick = product => {
        if (user.role === 'seller') return;
        setCart(getCart());
        setProduct(product);
        setProductFormShown(true);
    };

    const updateCart = productOrdered => {
        const carts = getArrayFromStorage(STORAGE_ITEMS.carts);
        const userCart = getCart();
        userCart.items = userCart.items.map(item => {
            if (item.id === productOrdered.id)
                item.order_quantity = productOrdered.order_quantity;
            return item;
        });
        const updatedCarts = carts.map(cart => cart.customer_id === userCart.customer_id ? userCart : cart);
        storeItems(STORAGE_ITEMS.carts, updatedCarts);
        setProductFormShown(false);
    };

    const addToCart = productOrdered => {
        const tmpCarts = getArrayFromStorage(STORAGE_ITEMS.carts);
        const tmpCart = getCart();
        const tmpCartItems = Array.from(tmpCart.items);
        if (tmpCartItems.length === 0) {
            tmpCartItems.push(productOrdered);
        } else {
            const existingItem = tmpCartItems.find(item => item.id === productOrdered.id);
            if (!existingItem)
                tmpCartItems.unshift(productOrdered);
            tmpCartItems.map(item => {
                if (item.id === productOrdered.id)
                    item.order_quantity = productOrdered.order_quantity;
                return item;
            });
        }
        tmpCart.items = tmpCartItems;
        const carts = tmpCarts.filter(cart => cart.customer_id === tmpCart.customer_id).length > 0
            ? tmpCarts.map(cart => cart.customer_id === tmpCart.customer_id ? tmpCart : cart)
            : [tmpCart, ...tmpCarts];
        storeItems(STORAGE_ITEMS.carts, carts);
        setProductFormShown(false);
    };

    return (<>
        { productFormShown && <CartForm
            product={product}
            cart={cart}
            show={productFormShown}
            onHide={() => setProductFormShown(false)}
            addToCart={addToCart}
            updateCart={updateCart} /> }
        <Container fluid>
            <Row className="justify-content-end">
                <Col lg="3" md="6">
                    <Form>
                        <Form.Control type="text" value={productSearch} onChange={handleProductSearch} placeholder="Search" className="me-2" />
                    </Form>
                </Col>
            </Row>
            <Row>
                { productsList.length === 0 && <Col className="text-center">
                    <h1 style={{ margin: '100px 15px', color: '#999' }}>
                        No products found for "{productSearch}"...
                    </h1>
                </Col> }
                { productsList.length > 0 && <div className="mdmx-products"> 
                    { productsList.sort((p1,p2) => p2.id - p1.id).map(product => (
                        <Card key={product.id}
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
                </div> }
            </Row>
        </Container>
    </>);
}
