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

const deleteItem = (id) => {
    const query =  `DELETE FROM tbl_barang WHERE tbl_barang.id_barang=${id}`;
    return dbConnection.execute(query);
}

const updateItem = (id,name,image,tipe,deskripsi,stock,harga) => {
    const query =  `UPDATE tbl_barang SET nama_barang='${name}',gambar_barang='${image}',jenis_barang='${tipe}',deskripsi_barang='${deskripsi}',stock=${stock},harga_sewa=${harga} WHERE tbl_barang.id_barang=${id}`;
    return dbConnection.execute(query);
}

module.exports = {
    getAllItem,
    getSingleItem,
    createItem,
    deleteItem,
    updateItem
}