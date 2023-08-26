const InfoChar = (props) => {
  const {data}=props
  return (
    <div>
      <div>Nombre: {data.name}</div>
      <div>
        <img src={data.image} alt={data.name} />
      </div>
    </div>
  )
}

export default InfoChar