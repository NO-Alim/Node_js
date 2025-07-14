
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
app.use(express.json()); // For parsing application/json

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1h'

const authTest = async () => {
  const saltRounds = 10;
  const plainPassword = 'superSecureP@ssw0rd!'
  let hashedPassword;
  // hash password
  hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log(hashedPassword);

  //compare password
  const isMatchOne = await bcrypt.compare(plainPassword, hashedPassword); // right password
  const isMatchTwo = await bcrypt.compare('34erwrwer', hashedPassword); //wrong password
  console.log(isMatchOne, isMatchTwo);

  // generate jwt token
  const payload = {
    userId: 'dfsdfsf',
    userName: 'Jhone Doe'
  }
  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
  console.log(`Generated Token: ${token}`);

  // decode token
  const decode = jwt.verify(token, JWT_SECRET);
  console.log(decode);
  
}

authTest();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});