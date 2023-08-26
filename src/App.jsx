
import { useEffect, useState } from 'react'
import './App.css'
import useToggle from './hooks/useToggle'
import useApi from './hooks/useApi'
import { global } from './variables/global'
import InfoChar from './components/InfoChar'
import './styles/appStyle.scss'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { ThreeCircles } from 'react-loader-spinner'
import ScrollToTop from "react-scroll-to-top";
/*
-Utilice la herramienta de bootstrap, ya que, los componentes que provee son amigables al trabar con ellos al tener
una buena documentación y permite generar una vista responsiva.
-En cuanto a le herramienta Sass, la utilice como complemento de css, ya que, me permite manejar mas cómodamente
los puntos de quiebre y asi mejorar la vista responsiva, ademas de, tener buena documentación para su uso.
-Los paquetes de react-scroll-to-top y react-loader-spinner los utilice para mejorar detalles concretos
para la vista y el funcionamiento mas cómodo para el usuario.
*/

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

  // filtrar según el estado y especie, también se considera el caso de que solo quiera buscar uno solo.
  function filter() {
    let aux = backUp
    let array = aux.filter(data => selStatus ? (data.status == selStatus) : (data.status !== null))
      .filter(data => selEspecie ? (data.species == selEspecie) : (data.species !== null))
      setMensaje('')
    if (array.length == 0) {
      // mensaje el cual indicara al usuario que los filtros seleccionados no arrojaron coincidencias
      setMensaje('No se encontraron coincidencias')
    }
    setInfo(array)
  }
  // limpiar filtros
  function limpiar() {
    setInfo(backUp)
    setSelEspecie('')
    setSelStatus('')
  }

  // obtener la especie desde la data principal, asi crear un array con todos los tipos de especie
  // de la respuesta, sin la necesidad de conocer cada uno de los tipos de especie.
  function spec(data) {
    let aux = []
    data.map(data => {
      aux.push(data.species)
    })
    // Set solo permite almacenar valores únicos por lo que descarta los repetidos y se queda con la
    // primera coincidencia
    const limpio = new Set(aux)
    let result = [...limpio]
    setEspecie(result.sort())
  }


  // obtener el estatus desde la data principal, asi crear un array con todos los tipos de status
  // de la respuesta, sin la necesidad de conocer cada uno de los tipos de status.
  function findStatus(data) {
    let aux = []
    data.map(data => {
      aux.push(data.status)
    })
    // Set solo permite almacenar valores únicos por lo que descarta los repetidos y se queda con la
    // primera coincidencia
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
      // ordeno los resultados de la respuesta por abecedario
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

  // Comparo toggle.active, ya que, este me permite controlar las llamadas asíncronas y en caso de estar
  // esperando la promesa lanzar aun loader al usuario y asi no ver "contenido en blanco"

  // Utilizo bastante los grid container de Bootstrap Row y Col, ya que, me permite manejar y hacerme una
  // imagen mental previa de como quedara en disposición el contenido y su vista responsiva.
  
  return toggle.active ? (
    <Row className='mainRow'>
      <ScrollToTop className='upArrow' smooth color="#050505" />
      <Col className='colForm' xs={12}>
        <Row>
          <Col xs={12} sm={6} md={4}>
            <Form.Select className='formSelect' value={selStatus} onChange={(e) => setSelStatus(e.target.value)} aria-label='Status'>
              <option>Status</option>
              {
                status.map((data, index) =>
                  <option key={index} value={data}>{data}</option>
                )
              }
            </Form.Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Form.Select value={selEspecie} onChange={(e) => setSelEspecie(e.target.value)} aria-label='Species'>
              <option>Species</option>
              {
                especie.map((data, index) =>
                  <option key={index} value={data}>{data}</option>
                )
              }
            </Form.Select>
          </Col>
          <Col xs={12} sm={12} md={4}>
            <Row className='rowFilterButton'>
              <Col>
                <Button className='buttonNav' variant="info"  onClick={() => filter()}>Search</Button>
              </Col>
              <Col>
                <Button className='buttonNav' variant="warning" onClick={() => limpiar()}>Clean</Button>
              </Col>
            </Row>

          </Col>
        </Row>
        <Row className='rowNav'>
          <Col className='colNav1'>
            {
              page.prev ? (
                <Button className='buttonNav' variant="dark" onClick={(e) => { anterior(); limpiar() }}>Previous</Button>
              ) : null
            }

          </Col>
          <Col className='colNav2'>
            {
              page.next ? (
                <Button className='buttonNav' variant="dark" onClick={(e) => { siguiente(); limpiar() }}>Next</Button>
              ) : null
            }

          </Col>
        </Row>

      </Col>


      <Row className='rowCard'>
        <div className='mensajeFilter'>{mensaje}</div>
        {
          toggle.active ? (
            info.map((data, index) =>

              <Col xs={12} sm={6} md={6} lg={3} className='colChar' key={data.id} >
                <InfoChar data={data}></InfoChar>
              </Col>
            )
          ) : (
            <div>Loading...</div>
          )
        }
      </Row>
    </Row>
  ) : (
    <div className='loadingSpinner'>
      <ThreeCircles
        height="100"
        width="100"
        color="#4fa94d"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="three-circles-rotating"
        outerCircleColor=""
        innerCircleColor=""
        middleCircleColor=""
      />
    </div>
  )
}

export default App
