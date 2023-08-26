import { Button, Card, Col, Modal, ModalFooter, Row } from "react-bootstrap"
import useToggle from "../hooks/useToggle"
import '../styles/infoCharStyle.scss'

const InfoChar = (props) => {
  const { data } = props
  const { active, toggleFalse, toggleTrue } = useToggle(false)
  return (
    <div className="divChar">
      <Card className="cardChar">
        <Card.Img variant="top" src={data.image} />
        <Card.Body>
          <Card.Title className="cardTitle">{data.name}</Card.Title>
        </Card.Body>
        <Card.Footer className="cardFooter">
          <Button variant="light" onClick={() => toggleTrue()}>Show more...</Button>
        </Card.Footer>
      </Card>

      {
        active &&
        <Modal
          show={active}
          onHide={() => toggleFalse()}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          className="modalChar"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              {data.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modalBodyChar">
            <Row>
              <Col>
                <img className="imgChar" src={data.image} alt={data.name} />
              </Col>
            </Row>
          </Modal.Body>
          <ModalFooter className="modalFooterChar">
            <Col className="colFooterChar" xs={12}>
              <Row>
                <Col xs={12}>
                  <span className="detalleChar">
                    Specie:
                  </span>
                  {data.species}
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <span className="detalleChar">
                    Status:
                  </span>
                  {data.status}
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <span className="detalleChar">
                    Gender:
                  </span>
                  {data.gender}
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <span className="detalleChar">
                    Origin:
                  </span>
                  {data.origin.name}
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <span className="detalleChar">
                    Location:
                  </span>
                  {data.location.name}
                </Col>
              </Row>

            </Col>
          </ModalFooter>
        </Modal>
      }
    </div>
  )
}

export default InfoChar