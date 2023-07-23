import { useEffect } from 'react'
import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import axios from 'axios'
import { useAuthStore } from "./stores/auth"

axios.defaults.baseURL = 'http://localhost:3000' + '/api'
axios.defaults.withCredentials = true

type Props = {
  children: React.ReactNode
}

const PrivateRoute = ({ children }: Props) => {
  const user = useAuthStore(state => state)

  if (!user.isLogin) {
    return <Navigate to="/login" replace />
  }

  return children
}

const PublicRoute = ({ children }: Props) => {
  const user = useAuthStore(state => state)

  if (user.isLogin) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const { login } = useAuthStore(state => state)

  useEffect(() => {
    async function loadUser () {
      try {
        const res = await axios.get("/auth")

        if(res.data) {
          login(res.data)
        }
      } catch (error) {
          console.log(error)
      } finally {
        // authDispacth({ type: 'STOP_LOADING' })
      }
    }

    loadUser()
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />

        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
      </Routes>
    </>
  )
}

export default App
