// game component

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Game = ({mode}) =>{
    const [players,setPlayers] = useState([])
    const [trigger,setTrigger] = useState(0)
    const [playerScore,setPlayerScore] = useState({})
    const [flag,setFlag] = useState(Array(9).fill(null))
    const [winner,setWinner] = useState('')
    const [switchButt,setSwithButt] = useState(true)
    const [trackingPlayer,setTrackPlayer] = useState({})
    const winningCombo = [
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [1,5,9],
        [3,5,7],
        [1,4,7],
        [2,5,8],
        [3,6,9]
    ]
    const buttons = document.querySelectorAll('.bord-butt')
    // console.log(`player track`,trackingPlayer)
    const userName = (player1,player2='bot')=>{
        setPlayers([{name:player1,symbol:'X'},{name:player2,symbol:'O'}])
        setTrackPlayer({[player1]:[],[player2]:[]})
        setPlayerScore({[player1]:0,[player2]:0})
    }

    if (trigger && mode.toLowerCase().includes('single') && !winner){
        // console.log('bot move')
        botLogic()
        // setTrigger(0)
    }

    // console.log(flag)
    function disable(){
        buttons.forEach(butt=>{
            butt.disabled = true
        })
    }

    

    function checkWinner (){
        // console.log('checking..')
        for (let combo of winningCombo) {
            const [a, b, c] = combo.map(i => i - 1); // Adjust indices to match flag (0-based indexing)
            // console.log('combo = ',combo)
            // console.log(`[${flag[a]},${flag[b]},${flag[c]}]`)
            if (flag[a] && flag[a] === flag[b] && flag[a] === flag[c]) {
                return players.filter(ele=>ele.symbol === flag[a]); // Returns a arr of obj of X or O
            }
        }
        return null; // No winner yet
    };

    function ButtonClick(e){
        if (players[trigger].symbol == 'O') e.target.style.color = 'green'
        else e.target.style.color = 'salmon'
        e.target.innerText = players[trigger].symbol
        e.target.removeEventListener('click', ButtonClick);
        e.target.disabled = true
        setTrackPlayer((prev)=>{
            let temp = [...prev[players[trigger].name].slice(),parseInt(e.target.name)]
            return {
                ...prev,[players[trigger].name]:temp
            }
        })
        flag[parseInt(e.target.name) - 1] = players[trigger].symbol; // Update flag based on button index
        setFlag(flag)
        // console.log(flag)
        if (switchButt){
            // console.log(`switch entered ${switchButt}`)
            setSwithButt(null)
        } 
        if (flag.every(ele => ele !== null)) {
            setWinner('its a tie!');
            disable()
        }

        if (winOrRun()) return
        if (trigger) setTrigger(0)
        else setTrigger(1)
    }

    function botLogic(){
        let botChoice
        for (let combo of winningCombo){
            let [a,b,c] = combo
            // console.log('combo',combo)
            let curplayer = trackingPlayer[players[trigger].name]
            let curp = trackingPlayer[players[0].name]
            let bool = false
            // console.log(`curplayer = `,curplayer)
            if ((curplayer.includes(a) && curplayer.includes(b)) || (curplayer.includes(c) && curplayer.includes(a)) || (curplayer.includes(b) && curplayer.includes(c))){
                
                // console.log('in curplayer')
                for (let i of combo){
                    if (! curplayer.includes(i) && !curp.includes(i)){
                        // console.log('bot move from loop 1 = ',i)
                        botChoice = i
                        bool = true
                        break
                    }

                }
                if (bool){
                    break
                }
            }

            
            // console.log(`player1 = `,curp)
            if ((curp.includes(a) && curp.includes(b)) || (curp.includes(c) && curp.includes(a)) || (curp.includes(b) && curp.includes(c))){
                // console.log('in curp')
                for (let i of combo){
                    if (! curp.includes(i) && ! curplayer.includes(i)){
                        // console.log('bot move from loop 2 = ',i)
                        botChoice = i
                        bool = true
                        break
                    }
                }
                if (bool){
                    break
                }
            }
                
        }

        if (!botChoice){
            const filteredArray = []
            flag.forEach((ele,index) =>{
                if (ele === null){
                    filteredArray.push(index)
                }
            })
        botChoice = filteredArray[Math.floor(Math.random() * filteredArray.length)]+1
        }

        if (!winner){
            [...buttons].some((ele,index)=>{
                if (index+1 == botChoice){
                        ele.innerText = players[trigger].symbol
                        ele.style.color = 'green'
                        ele.removeEventListener('click', ButtonClick);
                        ele.disabled = true
                        flag[parseInt(ele.name) - 1] = players[trigger].symbol; // Update flag based on button index
                        setFlag(flag)
                        setTrackPlayer((prev)=>{
                            let temp = [...prev[players[trigger].name].slice(),parseInt(ele.name)]
                            return {
                                ...prev,[players[trigger].name]:temp
                            }
                        })
    
                        if (winOrRun()){
                            // console.log('winner bot')
                            return true
                        } 
                        setTrigger(0)
                        return true
                    }
                // console.log('index',index)
                return false
                })
        }
 
    }

    const resetBoard = ()=>{
        setTrigger(0)
        setWinner('')
        buttons.forEach(butt=>{
            butt.innerText = ''
            butt.disabled = false
        })
        setFlag(Array(9).fill(null))
        setTrackPlayer({[players[0].name]:[],[players[1].name]:[]})
        setSwithButt(true)
    }

    const switchPlayers = () => {
        setPlayers((prevPlayers) => {
            const updatedPlayers = [
                { ...prevPlayers[1], symbol: "X" }, // New Player 1 gets "X"
                { ...prevPlayers[0], symbol: "O" }  // New Player 2 gets "O"
            ];
            return updatedPlayers;
        });
    };

    const buttonClickSingle = (e)=>{
        if (players[trigger].symbol == 'O') e.target.style.color = 'green'
        else e.target.style.color = 'salmon'
        e.target.innerText = players[trigger].symbol
        e.target.removeEventListener('click', ButtonClick);
        e.target.disabled = true
        flag[parseInt(e.target.name) - 1] = players[trigger].symbol; // Update flag based on button index
        setFlag(flag)
        setTrackPlayer((prev)=>{
            let temp = [...prev[players[trigger].name].slice(),parseInt(e.target.name)]
            return {
                ...prev,[players[trigger].name]:temp
            }
        })
        // console.log(flag)
        if (flag.every(ele => ele !== null)) {
            setWinner('its a tie!');
            disable()
        }

        if (winOrRun()) return
       
        if (trigger) setTrigger(0)
        else setTrigger(1)
    }

    function winOrRun(){
        const winner = checkWinner();
        if (winner) {
            let [win] = winner
            // console.log(`winner : ${win.name}`)
            setWinner(`winner : ${win.name}`);
            playerScore[win.name]+=1
            setPlayerScore(playerScore)
            disable()
            return true; // Stop further execution
        }
        return false
    }
    


    return(
        <>
        {mode && <>
            {mode.toLowerCase().includes('single') ? <FormSingle player1Name={players[0]} func={userName}/> : <FormMulty player1Name={players[0]} func={userName}/>}
        <div>
            <div className="score">
                {players.length > 0 ? (
                    <>
                        <p><span className="salmon">{players[0].name}</span> : {playerScore[players[0].name]}</p>
                        <p><span className="green">{players[1].name}</span> : {playerScore[players[1].name]}</p>
                    </>  
                ) : null}
            </div>
            
            <h1 className={winner.toLowerCase().includes('win') ? 'victory' : winner.toLowerCase().includes('tie') ? 'salmon' : ''}>{winner ? winner :(players.length > 0 ? `${players[trigger].name} : ${players[trigger].symbol}` : null)}</h1> 
            {/* <h1>{player2Name} : {playerSymbol['player2']}</h1> */}
            <Board func={mode.toLowerCase().includes('multi') ? ButtonClick : buttonClickSingle}/>
            <div className="retry-butt">
                <Link to={'/'}><button className="first">back</button></Link>
                {mode.toLowerCase().includes('multi') && switchButt && <button onClick={switchPlayers} style={{'background':'grey'}}> switch </button>}
                <button className={winner ? 'last anime' : 'last'} onClick={resetBoard}>reset board</button>
            </div>
        </div>
        </>}
        {!mode && <>
            <h1 style={{'textAlign':'center','textTransform':'uppercase'}}>network error : 404</h1>
        </>}
        </>
    )
}

const FormSingle = ({func,player1Name})=>{
    const [player1,setPlayer1] = useState('')

    const handleChange = (e)=>{
        setPlayer1(e.target.value)
    }

    const formSubmit = (e)=>{
        e.preventDefault()
        func(player1)
    }
    return(
        <form onSubmit={formSubmit} className={player1Name ? 'form-move' : '' }>
            <div>
                <input type="text" placeholder="enter your name" value={player1} onInput={handleChange} required/>
                <button type="submit">submit</button>
            </div>
        </form>
    )
}

const FormMulty = ({func,player1Name})=>{
    const [player1,setPlayer1] = useState('')
    const [player2,setPlayer2] = useState('')

    const handleChange = (e)=>{
        if (e.target.id == '1'){
            setPlayer1(e.target.value)
        }
        else setPlayer2(e.target.value)
    }

    const formSubmit = (e)=>{
        e.preventDefault()
        func(player1,player2)
    }
    return(
        <form onSubmit={formSubmit} className={player1Name ? 'form-move' : ''}>
            <div className="div-width">
                <input id='1' type="text" placeholder="enter player 1 name" value={player1} onInput={handleChange} required/>
                <input id='2' type="text" placeholder="enter player 2 name" value={player2} onInput={handleChange} required/>
                <button type="submit">submit</button>
            </div>
        </form>
    )
}



const Board = ({ func }) => {
    return (
        <div className="board">
            {Array(9).fill(null).map((_, index) => (
                <button
                    className="bord-butt"
                    name={index+1}
                    onClick={func} // Attach the click handler
                    key={index}
                ></button>
            ))}
        </div>
    );
};


export default Game