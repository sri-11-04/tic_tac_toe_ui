// welcome page
import { Link } from "react-router-dom"

const Welcome = ({func})=>{

    return (
        <div className="welcome">
            <h1>tic tac toe</h1>
            <Link className="link" to={'/game'}><p onClick={func}>single player</p></Link>
            <Link className="link" to={'/game'}><p onClick={func}>multiplayer</p></Link>
        </div>
    )
}


export default Welcome