
import { useEffect, useState } from 'react'
import './App.css'
import useToggle from './hooks/useToggle'
import useApi from './hooks/useApi'
import { global } from './variables/global'
import InfoChar from './components/InfoChar'

function App() {
  const toggle = useToggle(false)
  const { API_URL_CHARACTER } = global
  const { data, active, consume } = useApi(API_URL_CHARACTER)
  const [info, setInfo] = useState(null)
  const [page, setPage] = useState({})

  useEffect(() => {
    if(info==null){
      apiCall(API_URL_CHARACTER)
    }
  }, [active])

  // LLamada por defecto API    
  async function apiCall(url) {
    toggle.toggleFalse()
    await consume(url)
    if (!active) {
      setInfo(data.results.sort((a, b) => a.name.localeCompare(b.name)))
      setPage({
        next: data.info.next,
        prev: data.info.prev
      })
      toggle.toggleTrue()
    }
  }

// Funcion pagina siguiente
  async function siguiente(){
    toggle.toggleFalse()
    await fetch(page.next)
    .then(res=>res.json())
    .then(data=> {
      setInfo(data.results.sort((a, b) => a.name.localeCompare(b.name)))
      setPage({
        next: data.info.next,
        prev: data.info.prev
      })
      toggle.toggleTrue()    
    })
  }

  // Funcion pagina anterior
  async function anterior(){
    toggle.toggleFalse()
    await fetch(page.prev)
    .then(res=>res.json())
    .then(data=> {
      setInfo(data.results.sort((a, b) => a.name.localeCompare(b.name)))
      setPage({
        next: data.info.next,
        prev: data.info.prev
      })
      toggle.toggleTrue()    
    })
  }

  return (
    <div>
      {
        page.prev ? (
          <button onClick={(e) => anterior()}>Anterior</button>
        ) : null
      }
      {
        page.next?(
          <button onClick={(e) => siguiente()}>Siguiente</button>
        ):null
      }
      {
        toggle.active ? (
          info.map((data, index) =>
            <InfoChar key={data.id} data={data}></InfoChar>
          )
        ) : (<h1>Loading...</h1>)
      }
    </div>
  )
}

export default App
