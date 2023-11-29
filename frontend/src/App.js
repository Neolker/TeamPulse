import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './routes/Homepage'
import Register from './routes/Register'
import Login from './routes/Login'
import Application from './routes/Application'

const App = () => {
  return (
    <div>

      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/app' element={<Application />} />
        <Route path='*' element={<Homepage />} />
      </Routes>

    </div>
  )
}

export default App