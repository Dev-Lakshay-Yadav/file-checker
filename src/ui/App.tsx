import { useEffect, useState } from "react"

const App = () => {
  const [msg, setMsg] = useState("")

  useEffect(() => {
    // Call the Electron main process function
    window.api.helloWorld().then((res) => {
      console.log("From main:", res)
      setMsg(res)
    })
  }, [])

  return (
    <div className="bg-red-500 text-blue-500 p-4">
      <h1>App dev</h1>
      <p>Message from main: {msg}</p>
    </div>
  )
}

export default App
