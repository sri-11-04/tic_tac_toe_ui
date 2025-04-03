import { useState,useRef} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Welcome from './Welcome'
import { HashRouter as Router , Routes,Route } from 'react-router-dom'
import Game from './Game'
import soundError from "./assets/error-mild.mp3"
import clickSound from "./assets/click-mild.mp3"
import boatBattle_ from "./assets/cr-boat-battle-sound.mp3"



function App() {
  const [mode,setMode] = useState(null)

  const boatBattle = useRef(null)
  const sound = useRef(new Audio(clickSound))
  const error_sound = useRef(new Audio(soundError))

  boatBattle.current = new Audio(boatBattle_)
  boatBattle.current.volume = 0.1
  error_sound.current.volume = 0.8
  sound.current.volume = 0.2

  const changeMode = (e)=>{
    // console.log('innerText = ',e.currentTarget.innerText)
    // current target means it parent tag => to avoid the conflict of clicking the icon on the welcome page
    sound.current.play()
    setMode(e.currentTarget.innerText)
  }

  // console.log('mode = ',mode)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Welcome func={changeMode} gamePlay={boatBattle.current}/>}/>
          <Route path='/game' element={<div className='game-page'><Game mode={mode} sound={sound.current} error_sound={error_sound.current} gamePlay={boatBattle.current}/></div>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
