import React from 'react'
import './LandingHeader.css'
import logo from '../images/Logo_standart.svg'
import { Link } from 'react-router-dom'

const LandingHeader = () => {
  return (
    <div>
      <nav className='myNav'>
          <ul>
            <li><Link to="/"><img id="logo" src={logo} alt="Logo" /></Link></li>
          </ul>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/app">App</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register" role="button" className='test'>Register</Link></li>
          </ul>
      </nav>
    </div>
  )
}

export default LandingHeader