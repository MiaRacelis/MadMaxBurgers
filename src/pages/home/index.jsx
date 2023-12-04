import { useState } from 'react';
import {
    Col,
    Container,
    Form,
    Row
} from 'react-bootstrap';

import { STORAGE_ITEMS, getArrayFromStorage, getItem, storeItems } from '../../utils/storage-utils';
import { formatAmountWithCurrency } from '../../utils/number-utils';
import Card from '../../components/Card'
import CartForm from '../cart/CartForm';
import '../products/Products.css';

const isAuthenticated = getItem(STORAGE_ITEMS.isAuth) || false;
const user = getItem(STORAGE_ITEMS.user) || null;
const isLoggedIn = user !== null && isAuthenticated;

const PRODUCT_INIT_DATA = { id: null, name: '', description: '', price: 0.00, quantity: 0 };
const CART_INIT_DATA = { customer_id: isLoggedIn ? user.id : null, items: [] };

const getProducts = () => getArrayFromStorage(STORAGE_ITEMS.products);
const getCart = () => {
    const carts = getArrayFromStorage(STORAGE_ITEMS.carts)
    if (!isLoggedIn) return CART_INIT_DATA;
    const userCart = carts.find(cart => cart.customer_id === user.id);
    return userCart || CART_INIT_DATA;
};

export default function Home() {
    const [ product, setProduct ] = useState(PRODUCT_INIT_DATA);
    const [ productFormShown, setProductFormShown ] = useState(false);
    const [ productSearch, setProductSearch ] = useState('');
    const [ productsList, setProductsList ] = useState(getProducts());
    const [ cart, setCart ] = useState(CART_INIT_DATA);

    const handleProductSearch = event => {
        const searchValue = event.target.value;
        const filteredProducts = searchValue
            ? productsList.filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase()))
            : getProducts();
        setProductSearch(searchValue);
        setProductsList(filteredProducts);
    };

    const handleCardClick = product => {
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
            isLoggedIn={isLoggedIn}
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
                <div className="mdmx-products">
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
                </div>
            </Row>
        </Container>
    </>);
}
