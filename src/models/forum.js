const dbConnection = require('../config/database');

const getAllForum = ()=> {
    const query  = `SELECT * FROM tbl_forum`;
    return dbConnection.execute(query);
}

const getSingleForum = (id)=> {
    const query =  `SELECT * FROM tbl_forum WHERE tbl_forum.id_forum =${id} LIMIT 1`
    return dbConnection.execute(query);
}

const addForum = (image,name,deskripsi,create_at)=> {
    const query = `INSERT INTO tbl_forum(image,forum_name,deskripsi,last_message,create_at) VALUES ('${image}','${name}','${deskripsi}','','${create_at}')`;
    return dbConnection.execute(query);
}

const updateForum = (id,image,name,deskripsi)=> {
  const query = `UPDATE tbl_forum SET image='${image}',forum_name='${name}',deskripsi='${deskripsi}' WHERE tbl_forum.id_forum=${id}`;
  return dbConnection.execute(query);
}

const deleteForum = (id)=> {
    const query = `DELETE FROM tbl_forum WHERE tbl_forum.id_forum=${id}`;
    return dbConnection.execute(query);
}

module.exports = {
    getAllForum,
    getSingleForum,
    addForum,
    updateForum,
    deleteForum
}