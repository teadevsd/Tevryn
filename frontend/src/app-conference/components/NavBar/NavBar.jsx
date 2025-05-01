import React from 'react'
import { Link } from 'react-router-dom'
import assets from '../../../assets/assets'
import './NavBar.css'
import MobileNav from '../../utils/MobileNav/MobileNav'

const NavBar = () => {

  return (
    <div className='nav'>
      <div className="navCont">
        <Link
          to='/conference'
        >
          <img src={assets.conference} 
          alt="conference lgo" 
          width={50} height={50}/>

          <p>Teamo</p>
        </Link>
      </div>

      <div className='mobileNav'>
        <MobileNav/>
      </div>
    </div>
  )
}

export default NavBar