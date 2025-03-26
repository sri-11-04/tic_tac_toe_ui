// welcome page
import { GiRobotGolem } from "react-icons/gi";
import { FaPerson } from "react-icons/fa6";
import { Link } from "react-router-dom"

const Welcome = ({func})=>{
    const color = "#FFFF00"
    return (
        <div className="welcome">
            <h1>tic tac toe</h1>
            <Link className="link" to='/game'><p onClick={func}><GiRobotGolem color={color}/> single player</p></Link>
            <Link className="link" to='/game'><p onClick={func}><FaPerson color={color}/> multiplayer</p></Link>
        </div>
    )
}


export default Welcome