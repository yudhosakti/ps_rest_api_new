const dbConnection = require('../config/database');

const getAllRent = ()=> {
    const quuery = `SELECT * FROM tbl_penyewaan INNER JOIN tbl_user ON tbl_penyewaan.id_user=tbl_user.id_user INNER JOIN tbl_barang ON tbl_penyewaan.id_barang=tbl_barang.id_barang ORDER BY tbl_penyewaan.id_user`
    return dbConnection.execute(quuery);
}

const getSingleRent = (id)=> {
    const query = `SELECT * FROM tbl_penyewaan INNER JOIN tbl_user ON tbl_penyewaan.id_user=tbl_user.id_user INNER JOIN tbl_barang ON tbl_penyewaan.id_barang=tbl_barang.id_barang WHERE tbl_penyewaan.id_sewa=${id}`
    return dbConnection.execute(query);
}


module.exports = {
    getAllRent,
    getSingleRent
}