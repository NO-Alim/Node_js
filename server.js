const app = require('./app');
const { dbConnect } = require('./config/db');
require('dotenv');

const port = process.env.PORT || 3000;

dbConnect().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});