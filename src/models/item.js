const dbConnection = require('../config/database');

const getAllItem = ()=> {
    const query =  `SELECT * FROM tbl_barang`;
    return dbConnection.execute(query);
}

const getSingleItem = (id)=> {
    const query = `SELECT * FROM tbl_barang WHERE id_barang=${id}`;
    return dbConnection.execute(query);
}

const createItem = (name,image,tipe,deskripsi,stock,harga)=> {
    const query = `INSERT INTO tbl_barang(nama_barang,gambar_barang,jenis_barang,deskripsi_barang,stock,harga_sewa) VALUES ('${name}','${image}','${tipe}','${deskripsi}',${stock},${harga})`;
    return dbConnection.execute(query);
}

module.exports = {
    getAllItem,
    getSingleItem,
    createItem
}