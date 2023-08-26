
import { useEffect, useState } from 'react'
import './App.css'
import useToggle from './hooks/useToggle'
import useApi from './hooks/useApi'
import { global } from './variables/global'
import InfoChar from './components/InfoChar'

import { Button, Form } from 'react-bootstrap'

function App() {
  const toggle = useToggle(false)
  const { API_URL_CHARACTER } = global
  const { data, active, consume } = useApi(API_URL_CHARACTER)
  const [info, setInfo] = useState(null)
  const [backUp, setBackUp] = useState([])
  const [page, setPage] = useState({})
  const [especie, setEspecie] = useState([])
  const [status, setStatus] = useState([])
  const [selStatus, setSelStatus] = useState()
  const [selEspecie, setSelEspecie] = useState()
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (info == null) {
      apiCall(API_URL_CHARACTER)
    }
  }, [active])

// filtrar según el estado y especie
  function filter() {
    let aux = backUp
    let array = aux.filter(data => data.status == selStatus)
      .filter(data => data.species == selEspecie)
    if (array.length == 0) {
      setMensaje('No se encontraron coincidencias')
    }
    setInfo(array)
  }
  // limpiar filtros
  function limpiar(){    
    setInfo(backUp)
    setSelEspecie('')
    setSelStatus('')
  }

  // obtener la especie 
  function spec(data) {
    let aux = []
    data.map(data => {
      aux.push(data.species)
    })
    // Set solo permite almacenar valores únicos
    const limpio = new Set(aux)
    let result = [...limpio]
    setEspecie(result.sort())
  }

  function findStatus(data) {
    let aux = []
    data.map(data => {
      aux.push(data.status)
    })
    // Set solo permite almacenar valores únicos
    const limpio = new Set(aux)
    let result = [...limpio]
    setStatus(result.sort())
  }

  // LLamada por defecto API    
  async function apiCall(url) {
    toggle.toggleFalse()
    await consume(url)
    if (!active) {
      spec(data.results)
      findStatus(data.results)
      setInfo(data.results.sort((a, b) => a.name.localeCompare(b.name)))
      setBackUp(data.results.sort((a, b) => a.name.localeCompare(b.name)))
      setPage({
        next: data.info.next,
        prev: data.info.prev
      })
      toggle.toggleTrue()
    }
  }

  // Función pagina siguiente
  async function siguiente() {
    toggle.toggleFalse()
    await fetch(page.next)
      .then(res => res.json())
      .then(data => {
        spec(data.results)

        findStatus(data.results)
        setInfo(data.results.sort((a, b) => a.name.localeCompare(b.name)))
        setBackUp(data.results.sort((a, b) => a.name.localeCompare(b.name)))
        setPage({
          next: data.info.next,
          prev: data.info.prev
        })
        toggle.toggleTrue()
      })
  }

  // Función pagina anterior
  async function anterior() {
    toggle.toggleFalse()
    await fetch(page.prev)
      .then(res => res.json())
      .then(data => {
        spec(data.results)

        findStatus(data.results)
        setInfo(data.results.sort((a, b) => a.name.localeCompare(b.name)))
        setBackUp(data.results.sort((a, b) => a.name.localeCompare(b.name)))
        setPage({
          next: data.info.next,
          prev: data.info.prev
        })
        toggle.toggleTrue()
      })
  }

  return (
    <div>
      <Form.Select value={selStatus} onChange={(e) => setSelStatus(e.target.value)} aria-label='Status'>
        <option>Status</option>
        {
          status.map((data, index) =>
            <option key={index} value={data}>{data}</option>
          )
        }
      </Form.Select>
      <Form.Select value={selEspecie} onChange={(e) => setSelEspecie(e.target.value)} aria-label='Species'>
        <option>Species</option>
        {
          especie.map((data, index) =>
            <option key={index} value={data}>{data}</option>
          )
        }
      </Form.Select>
      <Button onClick={() => filter()}>Buscar</Button>
      <Button onClick={() => limpiar()}>Limpiar</Button>

      {
        page.prev ? (
          <button onClick={(e) => anterior()}>Anterior</button>
        ) : null
      }
      {
        page.next ? (
          <button onClick={(e) => siguiente()}>Siguiente</button>
        ) : null
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
