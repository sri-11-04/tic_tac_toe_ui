// welcome page
import { GiRobotGolem } from "react-icons/gi";
import { FaPerson } from "react-icons/fa6";
import { Link,useLocation } from "react-router-dom"
import { useEffect } from "react";


const Welcome = ({func,gamePlay})=>{
    const color = "#FFFF00"
    const location = useLocation()

    useEffect(()=>{
        // console.log('location = ',location.pathname)
        gamePlay.pause()
      },[location])
    return (
        <div className="welcome">
            <h1>tic tac toe</h1>
            {/* <div>
                <div className="idle">
                    <button>settings</button>
                    <button>play</button>
                    <button>mode</button>
                </div> */}
                <div className="pop">
                    <Link className="link" to='/game'><p onClick={func}><GiRobotGolem color={color}/> single player</p></Link>
                    <Link className="link" to='/game'><p onClick={func}><FaPerson color={color}/> multiplayer</p></Link>
                </div>
            {/* </div> */}
        </div>
    )
}


export default Welcome