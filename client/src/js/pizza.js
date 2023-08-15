import React, { useState } from 'react';
import axios from 'axios';
import '../css/pizza.css';

const Pizza = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  

  const NameChange = (e) => {
    setName(e.target.value);
  };

  const PriceChange = (e) => {
    setPrice(e.target.value);
  };

  const ImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    
  };

  const Submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/add_pizza', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clear form fields and image preview
      setName('');
      setPrice('');
      setImage(null);
      
     
      alert('Pizza added successfully');
      console.log('Pizza added successfully');
    } catch (error) {
      alert('Error adding Pizza');
      console.error('Error adding pizza:', error);
    }
  };

  return (
    <div className="add-pizza">
      <h1 className='pizzaHeading'>Add Pizza</h1>
      <form onSubmit={Submit}>
        <label className='pizaaLabel'>
          Name:
          <input className='pizaaInput' type="text" value={name} onChange={NameChange} />
        </label>
        <br /><br/>
        <label className='pizaaLabel'>
          Price:
          <input className='pizaaInput' type="number" value={price} onChange={PriceChange} />
        </label>
        <br /><br/>
        <label  className='pizaaLabel'>
          Photo:  
          <input className='pizaaInput' type="file" accept="image/*" onChange={ImageChange} />
        </label>
        <br />        
       
        <br /><br/>
        <button type="submit" id="addpizzabtn">Add Pizza</button>
      </form>
    </div>
  );
};

export default Pizza;
