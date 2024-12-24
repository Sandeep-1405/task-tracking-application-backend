const express = require('express');
const cors = require('cors');
const connectToDb = require('./db');
const dotenv = require('dotenv').config();
const router = require('./routes/route');

const app = express();
app.use(express.json());
app.use(cors());

connectToDb();

app.use(router);

app.listen(3001,()=>{
    console.log(`Server Running on Port 3001`);
});