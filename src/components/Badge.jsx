export default function Badge(props) {
    return (<div>
        <label className={`mdmx-badge mdmx-badge-${props.type}`}>{props.text && props.text.toUpperCase()}</label>
    </div>);
}