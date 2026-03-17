const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();
require('./models/user_model');


connectDB();

const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send("Hello Word>>>>>>>>>>>>>>>>>>>>>>")
});

app.listen(port, () => {
    console.log('Server is running on localhost:' + port);
});