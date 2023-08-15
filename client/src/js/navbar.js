import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../css/navbar.css'

const Navbar = () => {

 
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link  to="/add_pizza" style={{textDecoration:"none"}}>Add Pizza</Link>
          </li>
          <li>
            <Link to="/order" style={{textDecoration:"none"}}>Order</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
