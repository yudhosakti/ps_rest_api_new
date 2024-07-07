const dbConnection = require('../config/database')

const getAllGroup = () => {
    const query = `SELECT * FROM tbl_cs_group `
    return dbConnection.execute(query) 
}

const getSingleGroup = (time) => {
    const query = `SELECT * FROM tbl_cs_group WHERE tbl_cs_group.time ='${time}'`
    return dbConnection.execute(query)
}

const getAllGroupBySingleId = (id) => {
    const query = `SELECT * FROM tbl_cs_group INNER JOIN tbl_cs_member ON tbl_cs_group.id_cs = tbl_cs_member.id_cs INNER JOIN tbl_user ON tbl_cs_member.id_user = tbl_user.id_user WHERE EXISTS ( SELECT 1 FROM tbl_cs_member AS sub_member WHERE sub_member.id_cs = tbl_cs_group.id_cs AND sub_member.id_user = ${id} ) ORDER BY tbl_cs_group.id_cs ASC`
    return dbConnection.execute(query)
}

const getAllMessageSingleGroup = (id) => {
    const query = `SELECT * FROM tbl_cs_chat INNER JOIN tbl_cs_member ON tbl_cs_chat.id_member = tbl_cs_member.id_member INNER JOIN tbl_user ON tbl_user.id_user = tbl_cs_member.id_user  WHERE tbl_cs_chat.id_cs = ${id}  ORDER BY tbl_cs_chat.send_at DESC`
    return dbConnection.execute(query)
}

const createGroup = (time) => {
    const query = `INSERT INTO tbl_cs_group(time) VALUES ('${time}')`
    return dbConnection.execute(query)
}

const createMemberGroup = async (idCs,id_admin,id_user,create_at) => {
   const query = `INSERT INTO tbl_cs_member(id_cs,id_user,create_at) VALUES (${idCs},${id_admin},'${create_at}')`
   const query2 = `INSERT INTO tbl_cs_member(id_cs,id_user,create_at) VALUES (${idCs},${id_user},'${create_at}')`
 await dbConnection.execute(query)
    return await dbConnection.execute(query2)
}

const getSingleMember = (id_cs,id_user) => {
    const query = `SELECT * FROM tbl_cs_member WHERE id_user = ${id_user} AND id_cs = ${id_cs}`
    return dbConnection.execute(query)
}

const createMessage = (idCs,idMember,message,send_at) => {
    const  query = `INSERT INTO tbl_cs_chat(id_cs,id_member,message,is_update,send_at) VALUES (${idCs},${idMember},'${message}',0,'${send_at}')`
    return dbConnection.execute(query)
}

const updateMessage = (id_chat,message) => {
    const query = `UPDATE tbl_cs_chat SET message='${message}',is_update=1 WHERE id_chat = ${id_chat}`
    return dbConnection.execute(query)
}

const createGroupWithProcedure =(id_receiver,id_sender,pesan,waktu,memberTime) => {
    const query = `CALL tambahGroupService(${id_receiver},${id_sender},'${pesan}','${waktu}','${memberTime}')`
    return dbConnection.execute(query)
}

const sendMessageCsRealtime = (id_cs,id_member,pesan) => {
    const query = `CALL sendMessageCs(${id_cs},${id_member},'${pesan}')`
    return dbConnection.execute(query)
}

module.exports = {
    getAllGroup,
    getAllGroupBySingleId,
    getAllMessageSingleGroup,
    getSingleGroup,
    createGroup,
    createMessage,
    updateMessage,
    createMemberGroup,
    getSingleMember,
    createGroupWithProcedure,
    sendMessageCsRealtime
}



