import {useState} from 'react'

const useToggle = (val=false) => {
  const [active, setActive]= useState(val)
  
  function toggle(){
    setActive(!active)
  }
  function toggleTrue(){
    setActive(true)
  }
  function toggleFalse(){
    setActive(false)
  }

  return {active, toggle, toggleTrue, toggleFalse}
}

export default useToggle