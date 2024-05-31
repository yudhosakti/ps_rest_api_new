const dbConnection = require('../config/database');

const getAllUser = ()=> {
    const query = 'SELECT * FROM tbl_user';
    return dbConnection.execute(query);
 }

 const getSingleUser = (uid)=> {
    const query = `SELECT * FROM tbl_user where id_user=${uid} LIMIT 1`
    return dbConnection.execute(query);
 }

 const getRentPsSingleUser = (uid) => {
    const query = `SELECT *FROM tbl_penyewaan INNER JOIN tbl_user ON tbl_penyewaan.id_user=tbl_user.id_user INNER JOIN tbl_barang ON tbl_penyewaan.id_barang=tbl_barang.id_barang WHERE tbl_penyewaan.id_user=${uid};`
    return dbConnection.execute(query);
 }

 const createUser = (email,name,password)=> {
    const query = `INSERT INTO tbl_user(email,name,password) VALUES ('${email}','${name}',SHA1('${password}'))`;
    return dbConnection.execute(query);
 }

 const createAdmin = (email,name,password) => {
   const query = `INSERT INTO tbl_user(email,name,password,role) VALUES ('${email}','${name}',SHA1('${password}'),'admin')`;
   return dbConnection.execute(query);
 }

 const deleteUser = (uid) => {
    const query = `DELETE FROM tbl_user WHERE tbl_user.id_user='${uid}'`
    return dbConnection.execute(query);
 }

const updateUser = (uid,name,avatar)=> {
   if (avatar == '') {
     const query =   `UPDATE tbl_user SET name='${name}' WHERE tbl_user.id_user=${uid}`;
    return dbConnection.execute(query);
   } else {
      const query = `UPDATE tbl_user SET name='${name}',avatar='${avatar}' WHERE id_user = ${uid}`;
      return dbConnection.execute(query);
   }
    
}

const loginUser = (email,password) => {
   const query = `SELECT * FROM tbl_user WHERE tbl_user.email = '${email}' AND tbl_user.password = SHA1('${password}')`
   return dbConnection.execute(query);
}

const getAllBookmarkByIdUser = (id_user) => {
   const query = `SELECT * FROM tbl_bookmark INNER JOIN tbl_barang ON tbl_bookmark.id_barang = tbl_barang.id_barang WHERE tbl_bookmark.id_user = ${id_user}`
   return dbConnection.execute(query)
}

const getSingleBookmarkByIdUser = (id_user,id_barang) => {
   const query = `SELECT * FROM tbl_bookmark INNER JOIN tbl_barang ON tbl_bookmark.id_barang = tbl_barang.id_barang WHERE tbl_bookmark.id_user  = ${id_user} AND tbl_bookmark.id_barang = ${id_barang}`
   return dbConnection.execute(query)
}

const createBookmark = (id_user,id_barang,bookmark_at) => {
   const query = `INSERT INTO tbl_bookmark(id_user,id_barang,bookmark_at) VALUES (${id_user},${id_barang},'${bookmark_at}')`
   return dbConnection.execute(query)
}

const deleteBookmark = (id_bookmark) => {
   const query = `DELETE FROM tbl_bookmark WHERE id_bookmark = ${id_bookmark}`
   return dbConnection.execute(query)
}




 module.exports = {
    getAllUser,
    getSingleUser,
    getRentPsSingleUser,
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    createAdmin,
    getAllBookmarkByIdUser,
    createBookmark,
    deleteBookmark,
    getSingleBookmarkByIdUser
 }