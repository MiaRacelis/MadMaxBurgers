const ACTIONS_KEY = 'actions';


export default function Table(props) {
    return (<div>
        <div className="table-responsive">
            <table className="table table-sm table-striped table-hover align-middle">
                <thead>
                    <tr>
                        { props.fields.map((field, index) => (
                            <th key={index} scope="col" style={field.style}>{field.text}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    { props.data.map(item => (
                        <tr key={item.id}>
                            { props.fields.filter(field => field.key !== ACTIONS_KEY).map((field, index) => (
                                <td key={index}>{
                                    item[field.key].length > 30 ? item[field.key].substring(0, 30) + '...' : item[field.key]
                                }</td>
                            ))}
                            <td style={{ 'display': props.actions ? '' : 'none' }}>
                                { props.actions && props.actions.map((action, index) => (
                                    <button key={index} className={action.classes} onClick={() => action.handleClick(item)}>{ action.text }</button>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}