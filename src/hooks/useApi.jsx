import { useEffect, useState } from "react"
import useToggle from "./useToggle"

// Custom hook para consumir una api entregando la data
// active el cual corresponde a una herramienta para controlar para la asincronía 
// consume corresponde a la función la cual puede ser llamada para consumir una api

const useApi = ( url ) => {

    const { active, toggleFalse, toggleTrue } = useToggle(true)
    const [data, setData] = useState()

    async function consume(url) {
        toggleTrue()
        await fetch(url)
            .then(res => res.json())
            .then(re => {
                setData(re)
                toggleFalse()
            }
            )
    }
    useEffect(() => {
        consume(url)
    }, [])
    return { data, active, consume }
}

export default useApi