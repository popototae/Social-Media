import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { Routes, Route } from "react-router"
import { Home } from "./pages/Home"

function App() {

  return (
    <div className="min-h-screen flex">
      <Sidebar/>
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
