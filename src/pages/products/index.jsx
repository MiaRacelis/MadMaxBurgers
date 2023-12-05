import { useState } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import Card from '../../components/Card';
import ProductForm from './ProductForm';
import { STORAGE_ITEMS, getArrayFromStorage, storeItems } from '../../utils/storage-utils';
import { formatAmountWithCurrency } from '../../utils/number-utils';
import './Products.css';

export default function Products() {
    const PRODUCT_INIT_DATA = { id: null, name: '', description: '', price: 0.00, quantity: 0 };
    const [ product, setProduct ] = useState(PRODUCT_INIT_DATA);
    const [ productFormShown, setProductFormShown ] = useState(false);
    const [ productsList, setProductsList ] = useState(getArrayFromStorage(STORAGE_ITEMS.products));

    const handleCardClick = product => {
        setProductsList(getArrayFromStorage(STORAGE_ITEMS.products));
        setProduct(product);
        setProductFormShown(true);
    };

    const handleProductAdd = product => {
        const productIds = productsList.map(product => parseInt(product.id));
        const maxId = Math.max(...productIds);
        product.id = maxId + 1;
        const newProducts = [product, ...productsList]
        storeItems(STORAGE_ITEMS.products, newProducts);
        setProductsList(newProducts);
        setProductFormShown(false);
    };

    const handleProductUpdate = product => {
        const productIndex = productsList.findIndex(newProduct => newProduct.id === product.id);
        productsList[productIndex] = product;
        storeItems(STORAGE_ITEMS.products, productsList);
        setProductsList(productsList);
        setProductFormShown(false);
    };

    return (<>
        <Container fluid>
            <Row>
                { productFormShown && <ProductForm
                product={product}
                show={productFormShown}
                onHide={() => setProductFormShown(false)}
                handleProductAdd={handleProductAdd}
                handleProductUpdate={handleProductUpdate} /> }

                <h1>My Products</h1>
                <div className="mdmx-products">
                    { productsList.sort((p1,p2) => p2.id - p1.id).map(product => (
                        <Card
                            key={product.id}
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
                <button className="mdmx-float" onClick={() => {
                    setProduct(PRODUCT_INIT_DATA);
                    setProductFormShown(true);}}>
                    +
                </button>
            </Row>
        </Container>
    </>)
}