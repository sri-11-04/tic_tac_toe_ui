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
    setMode(e.target.innerText)
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
