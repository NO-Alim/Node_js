const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());


// home route
app.get('/', (req, res) => {
    res.send('<h1>This is the home page.</h1>')
})

// about route
app.get('/about', (req, res) => {
    res.send('<h1>This is the about page</h1>')
})

// dynamic route
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    res.send(`<h1>Product ${id}</h1>`)
})
// assignment: Return hardcoded JSON  
app.get('/api/products', (req, res) => {
    res.json([
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
        { id: 3, name: 'Product 3' },
    ])
})


//assignment: Return hardcoded JSON with order id
app.get('/api/orders/:ordId', (req, res) => {
    const orderId = req.params.ordId;

    const orders = {
        'ord001': { id: 'ord001', customer: 'Alice Smith', total: 150.75, items: ['Laptop', 'Mouse'] },
        'ord002': { id: 'ord002', customer: 'Bob Johnson', total: 50.00, items: ['Keyboard'] }
    };

    const order = orders[orderId];

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found with this id ' + orderId });
    }
})

app.post('/api/feedback', (req, res) => {
    const feedback = req.body;
    console.log(feedback);
    
    res.status(201).json({
        message: 'Feedback received',
        feedback
    })
})

// listen to the port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})