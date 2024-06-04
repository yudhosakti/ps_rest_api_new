const dbConnection = require('../config/database');

const getAllRent = ()=> {
    const quuery = `
    SELECT * FROM tbl_penyewaan INNER JOIN tbl_user ON tbl_user.id_user = tbl_penyewaan.id_user`
    return dbConnection.execute(quuery);
}

const getSingleRent = (id)=> {
    const query = `SELECT * FROM tbl_penyewaan WHERE tbl_penyewaan.id_transaksi='${id}'`
    return dbConnection.execute(query);
}

const getSingleRentById = (id)=> {
    const query = `SELECT * FROM tbl_penyewaan INNER JOIN tbl_user ON tbl_user.id_user = tbl_penyewaan.id_user WHERE id_sewa = ${id}`
    return dbConnection.execute(query);
}

const insertRent = (idBarang,idUser,id_transaksi,status,tanggal_sewa,tanggal_kembali)=> {
    const query = `INSERT INTO tbl_penyewaan(id_barang,id_user,id_transaksi,status,tanggal_sewa,tanggal_kembali) VALUES (${idBarang},${idUser},'${id_transaksi}','${status}','${tanggal_sewa}','${tanggal_kembali}')`;
    return dbConnection.execute(query);
}

const deleteRent = (id) => {
    const query = `DELETE FROM tbl_penyewaan WHERE tbl_penyewaan.id_sewa=${id}`;
    return dbConnection.execute(query);
}

const updateRent = (id,status) => {
    const query = `UPDATE tbl_penyewaan SET status='${status}' WHERE tbl_penyewaan.id_transaksi = '${id}'`;
    return dbConnection.execute(query);
}

const createRentNewMultiple = (id_user,order_id,tanggal_sewa,tanggal_kembali)=> {
    const query  =`INSERT INTO tbl_penyewaan(id_user,id_transaksi,status,tanggal_sewa,tanggal_kembali) VALUES (${id_user},'${order_id}','pending','${tanggal_sewa}','${tanggal_kembali}')`
    return dbConnection.execute(query)
}

const createItemRentMultiple = (id_item,id_sewa,quantity)=> {
    const query = `INSERT INTO tbl_barang_sewa(id_sewa,id_barang,quantity) VALUES (${id_sewa},${id_item},${quantity})`
    return dbConnection.execute(query)
}

const getAllItemRentByOrderId = (order_id) => {
    const query = `SELECT * FROM tbl_barang_sewa INNER JOIN tbl_penyewaan ON tbl_barang_sewa.id_sewa = tbl_penyewaan.id_sewa WHERE tbl_penyewaan.id_transaksi = '${order_id}' `
    return dbConnection.execute(query)
}

const deleteItemRentById = (id_bs) => {
    const query = `DELETE FROM tbl_barang_sewa WHERE id_bs = ${id_bs}`
    return dbConnection.execute(query)
}


module.exports = {
    getAllRent,
    getSingleRent,
    insertRent,
    deleteRent,
    updateRent,
    getSingleRentById,
    createRentNewMultiple,
    createItemRentMultiple,
    getAllItemRentByOrderId,
    deleteItemRentById
}