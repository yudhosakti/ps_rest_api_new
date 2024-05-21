const express = require('express');
const cors = require('cors')

const barangRoutes = require('./src/routes/item.js');
const userRoutes = require('./src/routes/user.js');
const rentRoutes = require('./src/routes/rent.js');
const chatRoutes = require('./src/routes/discussion.js');
const forumRoutes = require('./src/routes/forum.js');

const middleWare = require('./src/middleware/log.js');

const app = express();
let port = 4000;


app.use(middleWare.logRequest)
app.use(express.json())
app.use(cors())

app.use('/item', barangRoutes)

app.use('/user',userRoutes)

app.use('/rent',rentRoutes)

app.use('/chat',chatRoutes)

app.use('/forum',forumRoutes)


app.listen(port,() => {
    console.log("Server Running ",port)
})