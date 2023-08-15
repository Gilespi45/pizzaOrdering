import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './navbar';
import Order from './order';
import Pizza from './pizza';

function App() {
 

  
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navbar  />}
        >
          <Route
            path="add_pizza"
            element={<Pizza  />}
          />
          <Route
            path="order"
            element={<Order />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;