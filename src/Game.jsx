// game component

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Game = ({mode}) =>{
    const [players,setPlayers] = useState([]) //arr of obj stores playes name and symbol
    const [trigger,setTrigger] = useState(0) // to change from 0 to 1 ....
    const [playerScore,setPlayerScore] = useState({}) // stores an object of player : score
    const [flag,setFlag] = useState(Array(9).fill(null)) // list of X 0 or null to represent the board
    const [winner,setWinner] = useState('') // it is a msg win or tie
    const [switchButt,setSwithButt] = useState(true) // to add or switch user button in multi and to disable or enable select in single
    const [trackingPlayer,setTrackPlayer] = useState({}) // track player
    const [level,setLevel] = useState(false)   // false => normal; true => hard
    const playerColor = ['salmon','green'] // class name to color respective to the players index
    const winningCombo = [ // combination to win
        [1,2,3],
        [4,5,6],
        [7,8,9],
        [1,5,9],
        [3,5,7],
        [1,4,7],
        [2,5,8],
        [3,6,9]
    ]

    // select board button
    const buttons = document.querySelectorAll('.bord-butt')

    // it sets the name in the player arr of obj
    const userName = (player1,player2='bot')=>{
        setPlayers([{name:player1,symbol:'X'},{name:player2,symbol:'0'}])
        setTrackPlayer({[player1]:[],[player2]:[]})
        setPlayerScore({[player1]:0,[player2]:0})
    }

    // to set the level
    const levelChange = (e)=>{
        if (e.target.value === 'normal') setLevel(false)
        else setLevel(true)
    }

    // it triggers the bot to play
    if (trigger && mode.toLowerCase().includes('single') && !winner){
        
        setTimeout(()=>botLogic(level),1000)
    }

    // disable the button click after the match is over
    function disable(){
        buttons.forEach(butt=>{
            butt.disabled = true
        })
    }

    
    function checkWinner (real){
        /* 
        it checks the combo and the flag if flag's index and the combo has same symbol it returns it else null
        */
        for (let combo of winningCombo) {
            const [a, b, c] = combo.map(i => i - 1); // Adjust indices to match flag (0-based indexing)
            if (flag[a] && flag[a] === flag[b] && flag[a] === flag[c]) {
                if (real){ // it is to avoid minimax conflict
                    // this highlights the winner's combo block
                    buttons.forEach(butt=>{
                        if (combo.includes(parseInt(butt.name))){
                            butt.style.textShadow = '0px 0px 10px';
                        }
                    })
                }
                return players.filter(ele=>ele.symbol === flag[a]); // Returns a arr of obj of X or O player  
            }
        }
        return null; // no winner
    };

    function ButtonClick(e){
        /* 
        onclick function of the board
        which will add the class name to color up the text x or 0
        then add the players input to the trackplayer
        remove event and disable the targeted button
        adds the player symbol in the flag
        */
        
        e.target.classList.add(playerColor[trigger])
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

        if (switchButt){
        //    at the start it will enable then disabled
            setSwithButt(null)
        } 
        // draw checker
        if (flag.every(ele => ele !== null)) {
            setWinner('its a tie!');
            disable()
        }

        if (winOrRun()) return
        // triggering player1 and 2
        if (trigger) setTrigger(0)
        else setTrigger(1)
    }

    // minimax algo
    function minimax(alpha,beta,isMaximizing){
        const winner = checkWinner(false)
        const draw = flag.every(ele => ele!== null)
        if (winner){
            let [win] = winner
            if (win.symbol === 'X') return -1
            return 1 
        }
        else if (draw){
            return 0
        }

        if(isMaximizing){  // Ai's turn
            let best_score = -Infinity
            let score
            for (let i = 0;i<9;i++){
                if(flag[i]===null){
                    flag[i]='0'
                    score = minimax(alpha,beta,false)
                    alpha = Math.max(alpha,score)
                    flag[i] = null
                    best_score = Math.max(best_score,score)
                }
                if (alpha>=beta) break
            }
            return best_score
        }
        else{ // player's turn
            let least_score = Infinity
            let score
            for (let i = 0;i<9;i++){
                if(flag[i]===null){
                    flag[i] = 'X'
                    score = minimax(alpha,beta,true)
                    flag[i] = null
                    least_score = Math.min(least_score,score)
                    beta = Math.min(beta,score)
                }
                if (alpha >= beta) break
            }
            return least_score
        }
    }

    function hardLevel(){
        console.log('hard mode')
        let botChoice = null
        let best_score = -Infinity
        let score

        // First, check if AI can win immediately
        for (let i = 0;i<9;i++){
            if (flag[i]==null){
                // manualy take place in the mid to avoid double attack
                if (i===4 && flag[i]===null) return 5
                flag[i]= '0'
                if (checkWinner(false)){
                    return i+1
                }
                flag[i] = null
            }
        }

        // secondly, check if player win in next move
        for (let i = 0;i<9;i++){
            if (flag[i]===null){
                flag[i]= 'X'
                if (checkWinner(false)){
                    return i+1
                }
                flag[i] = null
            }
        }

        // minimax 

        for (let i = 0;i<9;i++){
            if(flag[i]===null){
                flag[i] = 'X'
                score = minimax(-Infinity,Infinity,false)
                flag[i] = null

                if (score > best_score){
                    best_score = score
                    botChoice = i+1
                }
            }
        }

        return botChoice

    }

    function botLogic(hard){
        let botChoice
        // normal function that blocks and wins in next move else botchoice will be a random number
        const normalLevel = ()=>{
            let curplayer = trackingPlayer[players[trigger].name]
            let player1 = trackingPlayer[players[0].name]
            for (let combo of winningCombo){
                let [a,b,c] = combo
                let bool = false
                // quickly returns 
                if ((curplayer.includes(a) && curplayer.includes(b)) || (curplayer.includes(c) && curplayer.includes(a)) || (curplayer.includes(b) && curplayer.includes(c))){
                    for (let i of combo){
                        if (! curplayer.includes(i) && !player1.includes(i)){
                            botChoice = i
                            bool = true
                            break
                        }
    
                    }
                    if (bool){
                        break
                    }
                }

                if ((player1.includes(a) && player1.includes(b)) || (player1.includes(c) && player1.includes(a)) || (player1.includes(b) && player1.includes(c))){
                    for (let i of combo){
                        if (! player1.includes(i) && ! curplayer.includes(i)){
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
            
            // random picking from the index of the null elements from the flag +1
            if (!botChoice){
                const filteredArray = []
                flag.forEach((ele,index) =>{
                    if (ele === null){
                        filteredArray.push(index)
                    }
                })
            botChoice = filteredArray[Math.floor(Math.random() * filteredArray.length)]+1
            }
        }

        // it runs normal or hard level
        if (hard) botChoice = hardLevel()
        else normalLevel()
        
        // console.log('botchoice = ',botChoice)
        if (!winner){
            [...buttons].some((ele,index)=>{
                // to simulate bot click (same in the buttonClick func)
                if (index+1 == botChoice){
                        ele.innerText = players[trigger].symbol
                        ele.classList.add(playerColor[trigger])
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

    // reset everything except score
    const resetBoard = ()=>{
        setTrigger(0)
        setWinner('')
        buttons.forEach(butt=>{
            butt.classList.remove(playerColor[0])
            butt.classList.remove(playerColor[1])
            butt.style.textShadow = ''
            butt.innerText = ''
            butt.disabled = false
            butt.style.backgroundColor = 'black'
        })
        setFlag(Array(9).fill(null))
        setTrackPlayer({[players[0].name]:[],[players[1].name]:[]})
        setSwithButt(true)
    }

    // onclick function that switches the player like player1 to player2 to own the x and first move
    const switchPlayers = () => {
        setPlayers((prevPlayers) => {
            const updatedPlayers = [
                { ...prevPlayers[1], symbol: "X" }, 
                { ...prevPlayers[0], symbol: "0" }  
            ];
            return updatedPlayers;
        });
    };

    // it checkes if the current move wins or should trigger next player
    function winOrRun(){
        const winner = checkWinner(true);
        if (winner) {
            console.log(winner)
            let [win] = winner
            console.log(`winner : ${win.name}`)
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
            {mode.toLowerCase().includes('single') && (
                <select disabled={!switchButt} onChange={levelChange} name="level" id="">
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                </select>
            )}
            <div className="score">
                {players.length > 0 ? (
                    <>
                        <p><span className="salmon">{players[0].name}</span> : <span>{playerScore[players[0].name]}</span></p>
                        <p><span className="green">{players[1].name}</span> : <span>{playerScore[players[1].name]}</span></p>
                    </>  
                ) : null}
            </div>
            
            <h1 className={winner.toLowerCase().includes('win') ? 'victory' : winner.toLowerCase().includes('tie') ? 'green' : playerColor[trigger]}>{winner ? winner :(players.length > 0 ? `${players[trigger].name} : ${players[trigger].symbol}` : null)}</h1> 
            {/* <h1>{player2Name} : {playerSymbol['player2']}</h1> */}
            <Board func={ButtonClick}/>
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

// single player form component
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
                <input type="text" autoFocus placeholder="enter your name" value={player1} onInput={handleChange} required/>
                <button type="submit">submit</button>
            </div>
        </form>
    )
}

// multi player form component
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
                <input id='1' type="text" placeholder="enter player 1 name" value={player1} onInput={handleChange} required autoFocus/>
                <input id='2' type="text" placeholder="enter player 2 name" value={player2} onInput={handleChange} required/>
                <button type="submit">submit</button>
            </div>
        </form>
    )
}


// board component
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