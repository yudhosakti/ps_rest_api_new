const express = require('express');
const cors = require('cors')
const multer = require('multer');
const path = require('path')
const { createServer } = require("http");
const { Server } = require("socket.io");


const barangRoutes = require('./src/routes/item.js');
const local = require('./src/config/host_local.js')
const userRoutes = require('./src/routes/person.js');
const otherRoutes = require('./src/routes/other.js')
const rentRoutes = require('./src/routes/rent.js');
const forumRoutes = require('./src/routes/forum.js');
const forumModels = require('./src/models/forum.js');
const serviceModels = require('./src/models/service.js');
const serviceRoutes = require('./src/routes/service.js');
const globalFunction = require('./src/controller/data/global_function.js');

const middleWare = require('./src/middleware/log.js');


const fileStorage = multer.diskStorage({
    destination: (req,res,cb) => {
        cb(null,'images/');
    },  
    filename: (req,res,cb) => {
        console.log(res)
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
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins. Adjust as needed.
        methods: ["GET", "POST","PUT","DELETE"]
    }
});
let port = 4000;

app.use(middleWare.logRequest);
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(multer({storage: fileStorage,fileFilter:fileFilter}).single('image'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/item', barangRoutes)

app.use('/person',userRoutes)

app.use('/rent',rentRoutes)

app.use('/forum',forumRoutes)

app.use('/service',serviceRoutes)

app.use('/other',otherRoutes)




io.on("connection", (socket) => {
    console.log('Connected');
    
    socket.on('sendMessage', async (data) => {
        try {
            let imageURl = ''
            if (data.image != '') {
                imageURl = data.image
            }
            // Insert the message into the forum
        await forumModels.sendMessageRealtimeForum(data.id_forum, data.id_user, data.message,imageURl).then((value)=>{
            const [dataNew] = value
            console.log(dataNew[0][0])

            // Prepare the JSON data to be emitted
            let jsonData = {
                id_chat: dataNew[0][0].id_discussion,
                id_forum: dataNew[0][0].id_forum,
                id_user: dataNew[0][0].id_user,
                name: dataNew[0][0].name,
                avatar: dataNew[0][0].avatar,
                message: dataNew[0][0].message,
                image: dataNew[0][0].image,
                type: dataNew[0][0].type,
                isUpdate: dataNew[0][0].is_update,
                send_at: globalFunction.formatTanggalPesan(dataNew[0][0].send_at) 
            };
            // Emit the new message to all connected clients
            io.emit('newMessage', jsonData); 

            });
            
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    socket.on('sendMessageCs', async (data) => {
        try {
        await serviceModels.sendMessageCsRealtime(data.id_cs, data.id_member, data.message).then((value)=>{
            const [dataNew] = value
            console.log(dataNew[0][0])

            let jsonData = {
                id_cs: dataNew[0][0].id_cs,
                id_member: dataNew[0][0].id_member,
                id_user: dataNew[0][0].id_user,
                name: dataNew[0][0].name,
                avatar: dataNew[0][0].avatar,
                message: dataNew[0][0].message,
                isUpdate: dataNew[0][0].is_update,
                send_at: globalFunction.formatTanggalPesan(dataNew[0][0].send_at) 
            };
            io.emit('newMessageCs', jsonData); 

            });
            
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Disconnected:', socket.id);
    });
    // Add any event listeners for the socket here
    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
});

httpServer.listen(port);