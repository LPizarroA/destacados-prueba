import { Button, Card, Modal, ModalFooter } from "react-bootstrap"
import useToggle from "../hooks/useToggle"

const InfoChar = (props) => {
  const {data}=props
  console.log(props)
  const {active, toggleFalse, toggleTrue} = useToggle(false)
  return (
    <div>
      <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={data.image} />
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
        <Button variant="primary" onClick={()=>toggleTrue()}>Show more...</Button>
      </Card.Body>
    </Card>
    {
      active && 
      <Modal
      show={active}
      onHide={() => toggleFalse()}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          {data.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={data.image} alt={data.name} />
        
      </Modal.Body>
      <ModalFooter>
        Species: {data.species}
        Status: {data.status}
        Gender: {data.gender}
        Origin: {data.origin.name}
        Location: {data.location.name}
      </ModalFooter>
    </Modal>
    }
    
    </div>
  )
}

export default InfoChar