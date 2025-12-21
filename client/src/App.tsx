import { Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { Messages } from "./pages/Messages"
import { Profile } from "./pages/Profile"
import { Friends } from "./pages/Friends"
import { Login } from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import { AppLayout } from "./components/AppLayout"
import { Register } from "./pages/Register"

function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} /> 
          <Route path="/friends" element={<Friends />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App
