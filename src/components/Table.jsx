const ACTIONS_KEY = 'actions';


const Table = ({ fields, data, emptyMessage, actions }) => {
    return (<div>
        <div className="table-responsive">
            <table className="table table-sm table-striped table-hover align-middle">
                <thead>
                    <tr>
                        { fields.map((field, index) => (
                            <th key={index} scope="col" style={field.style}>{field.text}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    { data.length === 0 && <tr className="tbl-empty">
                        <td colSpan={fields.length}>
                            <h4>{emptyMessage}</h4>
                        </td>
                    </tr> }
                    { data.length > 0 && data.map(item => (
                        <tr key={item.id}>
                            { fields.filter(field => field.key !== ACTIONS_KEY).map((field, index) => (
                                <td key={index}>{
                                    item[field.key].length > 30 ? item[field.key].substring(0, 30) + '...' : item[field.key]
                                }</td>
                            ))}
                            <td style={{ 'display': actions ? '' : 'none' }}>
                                { actions && actions.map((action, index) => (
                                    <button key={index} className={action.classes} onClick={() => action.handleClick(item)}>{ action.text }</button>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
};
export default Table;