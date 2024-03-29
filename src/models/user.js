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


 module.exports = {
    getAllUser,
    getSingleUser,
    getRentPsSingleUser,
 }