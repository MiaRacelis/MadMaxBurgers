import './Dashboard.css';
import { Chart } from 'react-google-charts';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getCurrentDate, getMonthName } from '../../utils/date-utils';
import { getOrderedProductsPerMonth, getCountsPerDay } from '../../utils/chart-utils';
import { STORAGE_ITEMS, getArrayFromStorage } from '../../utils/storage-utils';

export default function Dashboard() {
    const orders = getArrayFromStorage(STORAGE_ITEMS.orders);
    const customers = getArrayFromStorage(STORAGE_ITEMS.users)
        .filter(user => user.role === 'buyer');
    const products = getArrayFromStorage(STORAGE_ITEMS.products);

    const pieChartData = [
        ["My Data", "Quantities"],
        ["Customers", customers.length],
        ["Products", products.length],
        ["Orders", orders.length],
    ];

    const productNames = products.map(product => product.name);
    const barChartData = getOrderedProductsPerMonth(orders).reduce((results, productOrder) => {
        results.push(productNames.reduce((result, productName) => {
            result.push(productOrder.orders[productName] || 0);
            return result;
        }, [ productOrder.month ]));
        return results;
    }, [[ "Month", ...productNames]]);

    const orderCountsPerDay = getCountsPerDay(orders, 'order_date_time');
    const customerCountsPerDay = getCountsPerDay(customers, 'signup_date');
    const productCountsPerDay = getCountsPerDay(products, 'created_at');
    const days = [...Object.keys(orderCountsPerDay), ...Object.keys(customerCountsPerDay), ...Object.keys(productCountsPerDay)]
        .reduce((d1, d2) => { if (d1.indexOf(d2) < 0) d1.push(d2); return d1; }, [])
        .sort((d1, d2) => d1 - d2);
    const lineChartData = days.reduce((results, day) => {
        results.push([parseInt(day), customerCountsPerDay[day] || 0, productCountsPerDay[day] || 0, orderCountsPerDay[day] || 0]);
        return results;
    }, [[ "Day", "Customers", "Products", "Orders"]]);

    return (<div>
        <div className="mdmx-page-content">
            <h1>Dashboard</h1>
            <Container>
                <Row style={{ marginBottom: '40px' }}>
                    <Col>
                        <Chart
                        chartType="Bar"
                        width="100%"
                        height="400px"
                        data={barChartData}
                        options={{ chart: { title: 'Products ordered per month' } }} />
                    </Col>
                </Row>
                <Row style={{ marginBottom: '40px' }}>
                    <Col>
                        <Chart
                        chartType="PieChart"
                        data={pieChartData}
                        width="100%"
                        height="400px"
                        legendToggle/>
                    </Col>
                    <Col>
                        <Chart
                        chartType="Line"
                        width="100%"
                        height="400px"
                        data={lineChartData}
                        options={{ chart: { title: `As of ${getMonthName(getCurrentDate())} ${getCurrentDate().getFullYear()}`} }} />
                    </Col>
                </Row>
            </Container>
        </div>
    </div>);
}