import './Card.css';

export default function Card(props) {
    return (<div className={`card ${props.classes}`} style={{ width: "16rem" }} onClick={ () => props.handleClick(props.data) }>
        <div className="card-img" style={{ backgroundImage: `url("../img/${props.img}")` }}></div>
        <div className="card-body">
            <h5 className="card-title">{props.title}</h5>
            <p className="card-text">{props.text}</p>
            {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
        </div>
        <div className="card-footer text-body-secondary">{props.footer}</div>
    </div>);
}
