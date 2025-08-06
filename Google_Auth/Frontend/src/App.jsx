
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './login'
import Dashboard from './dashBoard'
import PageNotFound from './pageNotFound'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'


function App() {
  const GoogleAuthWrapper =()=>{
    return(
      <GoogleOAuthProvider clientId="754185985830-vmrpj3ktmglfm8rssh8b99ktkc6n1cur.apps.googleusercontent.com">
        <Login/>
      </GoogleOAuthProvider>
    )
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoogleAuthWrapper />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
