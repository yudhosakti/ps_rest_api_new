const dbConnection = require('../config/database');

const getAllChatById = (idForum)=> {
    const query = `SELECT * FROM tbl_discussion INNER JOIN tbl_user ON tbl_user.id_user=tbl_discussion.id_user INNER JOIN tbl_forum ON tbl_forum.id_forum=tbl_discussion.id_forum WHERE tbl_discussion.id_forum=${idForum} ORDER BY tbl_discussion.send_at DESC`
    dbConnection.execute(query);
}

const addChat = (idUser,idForum,message,send_at) => {
    const query = `INSERT INTO tbl_discussion(id_user,id_forum,message,send_at) VALUES ('${idUser}',${idForum},'${message}','${send_at}')`;
    dbConnection.execute(query);
}

const updateChat = (id_chat,message,send_at)=>{
    const query =  `UPDATE tbl_discussion SET message='${message}',send_at='${send_at}' WHERE tbl_discussion.id_chat = ${id_chat}`;
    dbConnection.execute(query);
} 

const deleteChat = (id_chat)=> {
    const query =  `DELETE FROM tbl_discussion WHERE tbl_discussion.id_chat =${id_chat}`;
    dbConnection.execute(query);
}

module.exports = {
    getAllChatById,
    addChat,
    updateChat,
    deleteChat
}