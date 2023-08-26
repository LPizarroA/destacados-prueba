import { useEffect, useState } from "react"
import useToggle from "./useToggle"

const useApi = ({ url }) => {

    const { active, toggleFalse } = useToggle(true)
    const [data, setData] = useState()

    async function consume() {
        await fetch(url)
            .then(res => res.json())
            .then(re => {
                setData(re)
                toggleFalse()
            }
            )
    }
    useEffect(() => {
        consume()
    }, [])
    return { data, active }
}

export default useApi