import "./Loader.module.css";

export default function Loader ({show}) {
    return show ? <div className="loader"></div> : <div>dont display</div>;
}  