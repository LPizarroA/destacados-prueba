import { useEffect, useState } from "react"
import useToggle from "./useToggle"

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