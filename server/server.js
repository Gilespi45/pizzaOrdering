const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const path = require("path");
const multer = require("multer");
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.use('/static', express.static(path.join(__dirname, 'static')));



// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/pizzaphoto', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// pizza schema
const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: { type: String,
     required: true }
});

const Pizza = mongoose.model('Pizza', pizzaSchema);

// Order schema
const orderSchema = new mongoose.Schema({
  ref_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

const storage = multer.diskStorage({
  destination: path.join(__dirname, './static/img'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.get('/pizzas', async (req, res) => {
  try {
    const pizzas = await Pizza.find({});
    res.json(pizzas);
  } catch (error) {
    console.error(error);
    res.json({ error: 'Server error' });
  }
});

app.post('/add_pizza', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.file;

    if (!name || !price || !image) {
      return res.json({ error: 'Missing required fields' });
    }

    const newPizza = new Pizza({ name, price, image: image.filename });
    await newPizza.save();
    res.json({ message: 'Pizza added successfully' });
  } catch (error) {
    console.error('Error adding pizza:', error);
    res.json({ error: 'Server error' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('ref_id');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.json({ error: 'Server error' });
  }
});

app.post('/orders', async (req, res) => {
  const { ref_id, qty, name, price } = req.body;

  try {
    const pizza = await Pizza.findById(ref_id);
    if (!pizza) {
      return res.status(404).json({ error: 'Pizza not found' });
    }

    const order = new Order({
      ref_id: pizza._id,
      qty,
      name,
      price,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.json({ error: 'Server error' });
  }
});
app.put('/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  const { qty, price } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ error: 'Order not found' });
    }

    // Update the order quantity and price
    order.qty = qty;
    order.price = price;

    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.json({ error: 'Server error' });
  }
});
app.delete('/orders/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    await Order.findByIdAndDelete(orderId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.json({ error: 'Server error' });
  }
});

app.put('/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  const { qty, name, price } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        qty,
        name,
        price,
      },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.json({ error: 'Server error' });
  }
});

app.delete('/orders/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    await Order.findByIdAndDelete(orderId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.json({ error: 'Server error' });
  }
});

app.delete('/orders', async (req, res) => {
  try {
    await Order.deleteMany({});
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
