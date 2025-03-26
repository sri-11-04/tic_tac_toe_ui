import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Welcome from './Welcome'
import { HashRouter as Router , Routes,Route } from 'react-router-dom'
import Game from './Game'



function App() {
  const [mode,setMode] = useState(null)

  const changeMode = (e)=>{
    // console.log('innerText = ',e.currentTarget.innerText)
    // current target means it parent tag => to avoid the conflict of clicking the icon on the welcome page
    setMode(e.currentTarget.innerText)
  }

  // console.log('mode = ',mode)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Welcome func={changeMode}/>}/>
          <Route path='/game' element={<div className='game-page'><Game mode={mode}/></div>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
