import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './routes/Homepage'

import Login from './routes/Login'
import { Register } from './routes/Register'

const App = () => {
  return (
    <div>

      <Routes>
        <Route path='/' element={<Homepage />} />

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register/>} />
        <Route path='*' element={<Homepage />} />
      </Routes>

    </div>
  )
}

export default App