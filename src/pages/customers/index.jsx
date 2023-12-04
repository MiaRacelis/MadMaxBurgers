import Table from "../../components/Table";
import { STORAGE_ITEMS, getArrayFromStorage } from "../../utils/storage-utils";

const customers = getArrayFromStorage(STORAGE_ITEMS.users)
    .filter(user => user.role === 'buyer');
const fields = [
    {
        key: 'username',
        text: 'Username'
    },
    {
        key: 'first_name',
        text: 'Name'
    },
    {
        key: 'last_name',
        text: ''
    },
    {
        key: 'email_address',
        text: 'Email Addres'
    },
    {
        key: 'mobile_number',
        text: 'Mobile Number'
    },
    {
        key: 'address',
        text: 'Address',
        style: {
            paddingRight: '20px'
        }
    }
];

export default function Customers() {
    return (<div className="mdmx-page-content">
        <h1>Customers</h1>
        <Table fields={fields} data={customers} />
    </div>);
}