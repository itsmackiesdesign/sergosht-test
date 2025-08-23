import { useEffect, useState } from "react"

export default function useFetch(url) {
  const [result, setResult] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setResult(data)
        setLoading(false)
      })
  }, [])

  return {loading, result}


}
