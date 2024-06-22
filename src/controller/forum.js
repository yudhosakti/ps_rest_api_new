const forumModel = require('../models/forum')
const globalFunction = require('./data/global_function')
const host = require('../config/host_local')
const fs = require('fs')

const getAllForum = async(req,response)=> {
    const {page} = req.params;
    try {
        const [data] = await forumModel.getAllForum();
        let dataFinal = [];
        let dataTemp = [];

        for (let index = 0; index < data.length; index++) {
            dataTemp.push({
                id_forum: data[index].id_forum,
                name: data[index].forum_name,
                image: data[index].forum_image,
                deskripsi: data[index].deskripsi,
                last_message: data[index].last_message,
                create_at: globalFunction.formatTanggal(data[index].create_at),
                created_by: {
                    id_user: data[index].id_user,
                    name: data[index].name,
                    avatar: data[index].avatar
                }
            });
            if (dataTemp.length == 25 || index+1 >= data.length) {
                dataFinal.push(dataTemp);
                dataTemp = [];
            }
            
        }

        if (page == undefined) {
            response.json({
                paginate: ({
                    max_page : dataFinal.length,
                    current_page : 1,
                    total_item_page : dataFinal[0].length
                }),
                data: dataFinal[0] 
            })
        } else {
            if (parseInt(page) <=0 || parseInt(page)> dataFinal.length || !Number.isInteger(parseInt(page))) {
                response.json({
                    message: 'Data Not Found'
                })
            } else {
                response.json({
                    paginate: ({
                        max_page : dataFinal.length,
                        current_page : parseInt(page),
                        total_item_page : dataFinal[parseInt(page)-1].length
                    }),
                    data: dataFinal[parseInt(page)-1] 
                })
            }
        }


    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
   
}

const getSingleForum = async(req,response)=> {
    const {id} = req.params;
    try {
        const [data] = await forumModel.getSingleForum(id);
        if (data.length == 0) {
            response.status(404).json({
                message: "Data Not Found"
            })
        } else {
            response.json({
                data: {
                    id_forum: data[0].id_forum,
                    name: data[0].forum_name,
                    image: data[0].forum_image,
                    deskripsi: data[0].deskripsi,
                    last_message: data[0].last_message,
                    create_at: globalFunction.formatTanggal(data[0].create_at)
                }
            })
        }
        
    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
}

const getAllChatSingleForum = async(req,response) => {
    const {id} = req.params
    try {
        const [data] = await forumModel.getAllChatSingleForum(id)
        let dataFinal = []
        let chatData = []
        if (data.length == 0) {
            response.status(404).json({
                message: "Chat Not Found"
            })
        } else {
            for (let index = 0; index < data.length; index++) {
                chatData.push({
                    id_chat: data[index].id_discussion,
                    id_user: data[index].id_user,
                    name: data[index].name,
                    avatar: data[index].avatar,
                    message: data[index].message,
                    image: data[index].image,
                    type: data[index].type,
                    send_at: globalFunction.formatTanggalPesan(data[index].send_at) 
                })
                
            }

            dataFinal.push({
                id_forum: data[0].id_forum,
                    name: data[0].forum_name,
                    image: data[0].forum_image,
                    deskripsi: data[0].deskripsi,
                    last_message: data[0].last_message,
                    create_at: globalFunction.formatTanggal(data[0].create_at),
                    chats: chatData
            })

            

            response.json({
                data: dataFinal[0]
            })
        }
        
    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
}

const addForum = async(req,response)=> {
    const dataInsert = req.body;
    let imageURL = ''
    if (req.file) {
        imageURL =  host.local+req.file.path.replace(/\\/g, '/');
    }
    try {
        console.log(imageURL)
        await forumModel.addForum(imageURL,dataInsert.name,dataInsert.deskripsi,globalFunction.getDateNow()).then(()=> {
            response.json({
                message: 'Create Forum Success',
                data: dataInsert
            })
        })
    } catch (error) {
        if (imageURL != '') {
            let urlFull = imageURL
            const pathFile = urlFull.split(host.local) 
            fs.unlink(pathFile[1],(err) => {
               if (err) {
                 console.log("Internal Error")
               }else{
                 console.log("Success")
               }
            })
        }
        response.status(500).json({
            message: error
        })
    }
}
const updateForum = async(req,response)=> {
    const {id} = req.params;
    const dataInsert = req.body;
    let imageURL = ''
    if (req.file) {
        imageURL =  host.local+req.file.path.replace(/\\/g, '/');
    }
    try {
        await forumModel.getSingleForum(id).then(async(value)=> {
           const [data] = value
           if (data.length == 0) {
            if (imageURL != '') {
                let urlFull = imageURL
                const pathFile = urlFull.split(host.local) 
                fs.unlink(pathFile[1],(err) => {
                   if (err) {
                     console.log("Internal Error")
                   }else{
                     console.log("Success")
                   }
                })
            }
            response.status(404).json({
                message :  'Forum Not Found'
            }) 
           } else {
            if (imageURL != '' && data[0].forum_image != null ) {
                let urlFull = data[0].forum_image
                const pathFile = urlFull.split(host.local) 
                fs.unlink(pathFile[1],(err) => {
                   if (err) {
                     console.log("Internal Error")
                   }else{
                     console.log("Success")
                   }
                })
            }
            await forumModel.updateForum(id,imageURL,dataInsert.name,dataInsert.deskripsi).then(()=> {
                response.json({
                    message: ' Update Forum Success',
                    data: dataInsert
                })
            })
           }
           
          
        })
       
    } catch (error) {
        if (imageURL != '') {
            let urlFull = imageURL
            const pathFile = urlFull.split(host.local) 
            fs.unlink(pathFile[1],(err) => {
               if (err) {
                 console.log("Internal Error")
               }else{
                 console.log("Success")
               }
            })
        }
        response.status(500).json({
            message: error
        })
    }
}
const deleteForum = async(req,response)=> {
    const {id} = req.params;
    try {
        await forumModel.getSingleForum(id).then(async(value)=>{
          const [data] = value
          if (data.length == 0) {
            response.status(404).json({
                message :  'Forum Not Found'
            }) 
          } else {
            if (data[0].forum_image != null || data[0].forum_image != '') {
                let urlFull = data[0].forum_image
                const pathFile = urlFull.split(host.local) 
                fs.unlink(pathFile[1],(err) => {
                   if (err) {
                     console.log("Internal Error")
                   }else{
                     console.log("Success")
                   }
                })
            }
            await forumModel.deleteForum(id).then(()=> {
             response.json({
                 message: 'Delete Forum Success',
                 id_deleted: id
             })
         })
          }
           
        })
        
    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
}

const createMessage = async(req,response) => {
    const dataInsert = req.body
    let imageURL = ''

    if (req.file) {
        imageURL = host.local+req.file.path.replace(/\\/g, '/');
    }
    try {
        await forumModel.createMessageForum(dataInsert.id_forum,dataInsert.id_user,dataInsert.message,imageURL,globalFunction.getDateTimeNow()).then(() => {
                response.json({
                    message: "Message Send Success",
                    data: dataInsert
                })
        })

        
    } catch (error) {
        if (imageURL != '') {
            let urlFull = imageURL
            const pathFile = urlFull.split(host.local) 
            fs.unlink(pathFile[1],(err) => {
               if (err) {
                 console.log("Internal Error")
               }else{
                 console.log("Success")
               }
            })
        }
        response.status(500).json({
            message: error
        })
    }
}

const updateMessage = async(req,response) => {
    const dataInsert = req.body
    let imageUrl = ''
    if (req.file) {
        imageUrl = host.local+req.file.path.replace(/\\/g, '/');
    }
    try {
        const [data] = await forumModel.getSingleMessageForum(dataInsert.id_discussion)
        if (data.length == 0) {
            if (imageUrl != '') {
                let urlFull = data[0].image
                const pathFile = urlFull.split(host.local) 
                fs.unlink(pathFile[1],(err) => {
                   if (err) {
                     console.log("Internal Error")
                   }else{
                     console.log("Success")
                   }
                })
            }
            response.status(404).json({
                message :  'Message Not Found'
            }) 
        } else {
            if (imageUrl != '' && data[0].image != null) {
                let urlFull = data[0].image
                const pathFile = urlFull.split(host.local) 
                fs.unlink(pathFile[1],(err) => {
                   if (err) {
                     console.log("Internal Error")
                   }else{
                     console.log("Success")
                   }
                })
            }
            await forumModel.updateMessageForum(dataInsert.id_discussion,dataInsert.message,imageUrl).then(() =>{
                response.json({
                    message: 'Update Message Success',
                    data: dataInsert
                })
            }) 
        }
        
        
        
    } catch (error) {
        if (imageUrl != '') {
            let urlFull = data[0].image
            const pathFile = urlFull.split(host.local) 
            fs.unlink(pathFile[1],(err) => {
               if (err) {
                 console.log("Internal Error")
               }else{
                 console.log("Success")
               }
            })
        }
        response.status(500).json({
            message: error
        })
    }
}

const deleteMessageForum = async(req,response) => {
    const dataInsert = req.body
    try {
        const [data] = await forumModel.getSingleMessageForum(dataInsert.id_discussion)
        if (data.length == 0) {
            response.status(404).json({
                message :  'Message Not Found'
            }) 
        } else {
            if (data[0].image != null) {
                let urlFull = data[0].image
                const pathFile = urlFull.split(host.local) 
                fs.unlink(pathFile[1],(err) => {
                   if (err) {
                     console.log("Internal Error")
                   }else{
                     console.log("Success")
                   }
                })
            }
            await forumModel.deleteMessageForum(dataInsert.id_discussion).then(() => {
                response.json({
                    message: "Chat Deleted Succes"
                })
            })
        }
        
        
    } catch (error) {
        response.status(500).json({
            message: error
        })
    }
}

module.exports= {
    getAllForum,
    getSingleForum,
    addForum,
    updateForum,
    deleteForum,
    getAllChatSingleForum,
    createMessage,
    updateMessage,
    deleteMessageForum
}
