const express = require('express');

const barangRoutes = require('./src/routes/item.js');
const userRoutes = require('./src/routes/user.js');
const rentRoutes = require('./src/routes/rent.js');

const middleWare = require('../rest_api_ps/src/middleware/log.js');

const app = express();
let port = 4000;


app.use(middleWare.logRequest)
app.use(express.json())

app.use('/item', barangRoutes)

app.use('/user',userRoutes)

app.use('/rent',rentRoutes)


app.listen(port,() => {
    console.log("Server Running ",port)
})