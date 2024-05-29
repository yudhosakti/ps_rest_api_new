const express = require('express');
const cors = require('cors')
const multer = require('multer');
const path = require('path')

const barangRoutes = require('./src/routes/item.js');
const userRoutes = require('./src/routes/person.js');
const rentRoutes = require('./src/routes/rent.js');
const chatRoutes = require('./src/routes/discussion.js');
const forumRoutes = require('./src/routes/forum.js');
const serviceRoutes = require('./src/routes/service.js');

const middleWare = require('./src/middleware/log.js');


const fileStorage = multer.diskStorage({
    destination: (req,res,cb) => {
        cb(null,'images/');
    },
    filename: (req,res,cb) => {
       cb(null,new Date().getTime() + '-' + res.originalname)
    }
})

const fileFilter = (req,res,cb) => {
    if (res.mimetype == 'image/png' || res.mimetype == 'image/jpg' || res.mimetype == 'image/jpeg') {
        cb(null,true)
    }else{
        cb(null,false)
    }
}


const app = express();
let port = 4000;

app.use(middleWare.logRequest);
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(multer({storage: fileStorage,fileFilter:fileFilter}).single('image'))
app.use(express.json())
app.use(cors())

app.use('/item', barangRoutes)

app.use('/person',userRoutes)

app.use('/rent',rentRoutes)

app.use('/chat',chatRoutes)

app.use('/forum',forumRoutes)

app.use('/service',serviceRoutes)


app.listen(port,() => {
    console.log("Server Running ",port)
})