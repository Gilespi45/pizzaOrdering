import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/order.css';

function Order() {
  const [pizza, setPizza] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);

  useEffect(() => {
    fetchPizza();
    fetchOrders();
  }, []);

  const fetchPizza = async () => {
    try {
      const response = await axios.get('http://localhost:5000/pizzas');
      setPizza(response.data);
    } catch (error) {
      console.error('Error fetching pizzas:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const BuyNow = async (pizzaId) => {
    try {
      const selectedPizza = pizza.find((n) => n._id === pizzaId);
      const totalPrice = selectedPizza.price * selectedQuantity;

      await axios.post('http://localhost:5000/orders', {
        ref_id: pizzaId,
        qty: selectedQuantity,
        name: selectedPizza.name,
        price: totalPrice,
      });
      alert('Pizza purchased successfully.');
      fetchOrders();
    } catch (error) {
      console.error('Error purchasing pizza:', error);
      alert('Error purchasing pizza.');
    }
  };

  const DeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5000/orders/${orderId}`);
      alert('Order deleted successfully.');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order.');
    }
  };

  const EditOrder = (orderId, quantity) => {
    setEditOrderId(orderId);
    setEditQuantity(quantity);
  };

  const UpdateOrder = async () => {
    try {
      const existingOrder = orders.find((order) => order._id === editOrderId);
      const newPrice = existingOrder.price / existingOrder.qty * editQuantity;
  
      await axios.put(`http://localhost:5000/orders/${editOrderId}`, {
        qty: editQuantity,
        price: newPrice,
      });
  
      alert('Order updated successfully.');
      setEditOrderId(null);
      setEditQuantity(1);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order.');
    }
  };

  const DeleteAllOrders = async () => {
    try {
      await axios.delete('http://localhost:5000/orders');
      alert('All orders deleted successfully.');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting all orders:', error);
      alert('Error deleting all orders.');
    }
  };

  return (
    <div>
      <h1 className='orderHeading'>Buy Pizza</h1>
      <div className="orderCards">
        {pizza.map((pizzaItem) => (
          <div className="orderCard" key={pizzaItem._id}>
            <div>
              <img src={`http://localhost:5000/static/img/${pizzaItem.image}`} alt={pizzaItem.name} />
              <h5>{pizzaItem.name}</h5>
              <p className='orderPrice'>
                Price: {pizzaItem.price} <br />
                <label>
                  Quantity:
                  <select value={selectedQuantity} onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </label>
                <button id='oderBuyNow' type="button" onClick={() => BuyNow(pizzaItem._id)}>
                  Buy Now
                </button>
              </p>
            </div>
          </div>
        ))}
      </div>
          <div className='orderPizza'>
      <h2 className='orderTable'>Ordered Pizzas</h2>
      <table className="orders" border={1} >
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.name}</td>
              <td>
                {editOrderId === order._id ? (
                  <input type="number" value={editQuantity} onChange={(e) => setEditQuantity(parseInt(e.target.value))} />
                ) : (
                  order.qty
                )}
              </td>
              <td>{order.price}</td>
              <td>
                {editOrderId === order._id ? (
                  <button className='orderBtn' type="button" onClick={UpdateOrder}>
                    Save
                  </button>
                ) : (
                  <>
                    <button className='orderBtn' type="button" onClick={() => EditOrder(order._id, order.qty)}>
                      Edit
                    </button>
                    <button className='orderBtn' type="button" onClick={() => DeleteOrder(order._id)}>
                      Delete 
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button id='orderDelete' className='orderBtn' type="button" onClick={DeleteAllOrders}>
        Delete All Orders
      </button>
      </div>
    </div>
  );
}

export default Order;
