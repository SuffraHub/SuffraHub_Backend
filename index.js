const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');

require('dotenv').config();


app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.json({ message: 'main'});
});

const userRoutes = require('./routes/user');

app.use('/user', userRoutes);



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
