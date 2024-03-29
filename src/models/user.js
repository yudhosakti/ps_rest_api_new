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

 const createUser = (uid,email,name)=> {
    const query = `INSERT INTO tbl_user (id_user,email,name) VALUES ('${uid}','${email}','${name}')`;
    return dbConnection.execute(query);
 }

 const deleteUser = (uid) => {
    const query = `DELETE FROM tbl_user WHERE tbl_user.id_user='${uid}'`
    return dbConnection.execute(query);
 }

const updateUser = (uid,name)=> {
    const query =   `UPDATE tbl_user SET name='${name}' WHERE tbl_user.id_user='${uid}'`;
    return dbConnection.execute(query);
}


 module.exports = {
    getAllUser,
    getSingleUser,
    getRentPsSingleUser,
    createUser,
    deleteUser,
    updateUser
 }