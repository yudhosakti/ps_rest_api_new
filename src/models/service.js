const dbConnection = require('../config/database')

const getAllGroup = () => {
    const query = `SELECT * FROM tbl_cs_group `
    return dbConnection.execute(query) 
}

const getSingleGroup = (id) => {
    const query = `SELECT * FROM tbl_cs_group WHERE tbl_cs_group.id_cs =${id}`
    return dbConnection.execute(query)
}

const getAllGroupBySingleId = (id) => {
    const query = `SELECT * FROM tbl_cs_group WHERE tbl_cs_group.id_sender = ${id} OR tbl_cs_group.id_receiver = ${id}`
    return dbConnection.execute(query)
}

const getAllMessageSingleGroup = (id) => {
    const query = `SELECT * FROM tbl_cs_chat INNER JOIN tbl_cs_group ON tbl_cs_group.id_cs = tbl_cs_chat.id_cs INNER JOIN tbl_user ON tbl_cs_chat.id_user = tbl_user.id_user  WHERE tbl_cs_chat.id_cs = ${id} ORDER BY tbl_cs_chat.send_at DESC`
    return dbConnection.execute(query)
}

const createGroup = (sender,receiver) => {
    const query = `INSERT INTO tbl_cs_group(id_sender,id_receiver) VALUES (${sender},${receiver})`
    return dbConnection.execute(query)
}

const createMessage = (idCs,idUser,message,send_at) => {
    const  query = `INSERT INTO tbl_cs_chat( id_cs,id_user,message,send_at) VALUES (${idCs},${idUser},'${message}','${send_at}')`
    return dbConnection.execute(query)
}

const updateMessage = (id_message,message) => {
    const query = `UPDATE tbl_cs_chat SET message='${message}',is_update=1 WHERE tbl_cs_chat.id_chat = ${id_message}`
    return dbConnection.execute(query)
}

module.exports = {
    getAllGroup,
    getAllGroupBySingleId,
    getAllMessageSingleGroup,
    getSingleGroup,
    createGroup,
    createMessage,
    updateMessage
}



