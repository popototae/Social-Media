import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { Routes, Route } from "react-router"
import { Home } from "./pages/Home"
import { Messages } from "./pages/Messages"

function App() {

  return (
    <div className="min-h-screen flex">
      <Sidebar/>
      <div className="grow pl-80">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/messages" element={<Messages/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
