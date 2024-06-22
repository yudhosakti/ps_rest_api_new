const dbConnection = require('../config/database');

const getAllForum = ()=> {
    const query  = `SELECT * FROM tbl_forum INNER JOIN tbl_user ON tbl_forum.id_user = tbl_user.id_user`;
    return dbConnection.execute(query);
}

const getSingleForum = (id)=> {
    const query =  `SELECT * FROM tbl_forum WHERE tbl_forum.id_forum =${id} LIMIT 1`
    return dbConnection.execute(query);
}

const getAllChatSingleForum = (id) => {
    const query = `SELECT * FROM tbl_discussion INNER JOIN tbl_forum ON tbl_discussion.id_forum = tbl_forum.id_forum INNER JOIN tbl_user ON tbl_discussion.id_user = tbl_user.id_user WHERE tbl_discussion.id_forum = ${id} ORDER BY tbl_discussion.send_at DESC`;
    return dbConnection.execute(query)
}

const addForum = (image,name,deskripsi,create_at)=> {
    if (image == '') {
    const query = `INSERT INTO tbl_forum(forum_name,deskripsi,last_message,create_at) VALUES ('${name}','${deskripsi}',NULL,'${create_at}')`;
    return dbConnection.execute(query);
    } else {
        const query = `INSERT INTO tbl_forum(forum_name,deskripsi,last_message,create_at,forum_image) VALUES ('${name}','${deskripsi}',NULL,'${create_at}','${image}')`;
    return dbConnection.execute(query);
    }
}

const updateForum = (id,image,name,deskripsi)=> {
    if (image == '' || image == null) {
const query = `UPDATE tbl_forum SET forum_name='${name}',deskripsi='${deskripsi}' WHERE tbl_forum.id_forum=${id}`;
  return dbConnection.execute(query);
    } else {
        const query = `UPDATE tbl_forum SET forum_image='${image}',forum_name='${name}',deskripsi='${deskripsi}' WHERE tbl_forum.id_forum=${id}`;
  return dbConnection.execute(query);
    }
  
}

const deleteForum = (id)=> {
    const query = `DELETE FROM tbl_forum WHERE tbl_forum.id_forum=${id}`;
    return dbConnection.execute(query);
}

const createMessageForum = (id_forum,id_user,message,image,send_at) => {
    if (image == '' || image == undefined) {
        const query = `INSERT INTO tbl_discussion(id_forum,id_user,message,image,is_update,type,send_at) VALUES (${id_forum},${id_user},'${message}',NULL,0,'text','${send_at}')`
        return dbConnection.execute(query)
    } else {
        const query = `INSERT INTO tbl_discussion(id_forum,id_user,message,image,is_update,type,send_at) VALUES (${id_forum},${id_user},'${message}','${image}',0,'image','${send_at}')`
        return dbConnection.execute(query)
    }
}

const updateMessageForum = (id_discussion,message,image) => {
    if (image == '' || image == undefined) {
        const query = `UPDATE tbl_discussion SET message='${message}',is_update=1,type='text' WHERE id_discussion = ${id_discussion}`
        return dbConnection.execute(query)
    } else {
        const query = `UPDATE tbl_discussion SET message='${message}',image='${image}',is_update=1,type='image' WHERE id_discussion = ${id_discussion}`
        return dbConnection.execute(query)
    }
}

const deleteMessageForum = (id_discussion) => {
    const query = `DELETE FROM tbl_discussion WHERE id_discussion = ${id_discussion}`
    return dbConnection.execute(query)
}

const getSingleMessageForum = (id_discussion) => {
    const query = `SELECT * FROM tbl_discussion WHERE id_discussion = ${id_discussion}`
    return dbConnection.execute(query)
}



module.exports = {
    getAllForum,
    getSingleForum,
    addForum,
    updateForum,
    deleteForum,
    getAllChatSingleForum,
    createMessageForum,
    updateMessageForum,
    deleteMessageForum,
    getSingleMessageForum
}