
import { useEffect } from 'react'
import './App.css'

function App() {

  async function api(){
    await fetch("https://rickandmortyapi.com/api/character")
      .then(res=>res.json())
      .then(res=>console.log(res))
  }

  return (
    <div>
      <button onClick={(e)=>api()} >test</button>
    </div>
  )
}

export default App
