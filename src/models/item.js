const dbConnection = require('../config/database');

const getAllItem = ()=> {
    const query =  `SELECT * FROM tbl_barang`;
    return dbConnection.execute(query);
}

const getSingleItem = (id)=> {
    const query = `SELECT * FROM tbl_barang WHERE id_barang=${id}`;
    return dbConnection.execute(query);
}

const getAllRentSingleItem = (id) => {
    const query = `SELECT * FROM tbl_barang INNER JOIN tbl_penyewaan ON tbl_barang.id_barang = tbl_penyewaan.id_barang INNER JOIN tbl_user ON tbl_user.id_user = tbl_penyewaan.id_user WHERE tbl_barang.id_barang = ${id}`;
    return dbConnection.execute(query);
}

const getAllReviewSingleItem = (id) => {
    const query = `SELECT * FROM tbl_barang INNER JOIN tbl_review ON tbl_barang.id_barang = tbl_review.id_barang INNER JOIN tbl_user ON tbl_review.id_user = tbl_user.id_user  WHERE tbl_barang.id_barang = ${id} ORDER BY tbl_review.review_at DESC` ;
    return dbConnection.execute(query)
}

const createItem = (name,image,tipe,deskripsi,stock,harga)=> {
    if (image == '') {
        const query = `INSERT INTO tbl_barang(nama_barang,gambar_barang,jenis_barang,deskripsi_barang,stock,harga_sewa) VALUES ('${name}',NULL,'${tipe}','${deskripsi}',${stock},${harga})`;
    return dbConnection.execute(query);
    } else {
        const query = `INSERT INTO tbl_barang(nama_barang,gambar_barang,jenis_barang,deskripsi_barang,stock,harga_sewa) VALUES ('${name}','${image}','${tipe}','${deskripsi}',${stock},${harga})`;
    return dbConnection.execute(query);
    }
    
}

const deleteItem = (id) => {
    const query =  `DELETE FROM tbl_barang WHERE tbl_barang.id_barang=${id}`;
    return dbConnection.execute(query);
}

const updateItem = (id,name,image,tipe,deskripsi,stock,harga) => {
    if (image == '') {
        const query =  `UPDATE tbl_barang SET nama_barang='${name}',jenis_barang='${tipe}',deskripsi_barang='${deskripsi}',stock=${stock},harga_sewa=${harga} WHERE tbl_barang.id_barang=${id}`;
    return dbConnection.execute(query);
    } else {
        const query =  `UPDATE tbl_barang SET nama_barang='${name}',gambar_barang='${image}',jenis_barang='${tipe}',deskripsi_barang='${deskripsi}',stock=${stock},harga_sewa=${harga} WHERE tbl_barang.id_barang=${id}`;
    return dbConnection.execute(query);
    }
    
}

const getSingleReviewById = (id_review) => {
    const query = `SELECT * FROM tbl_review WHERE id_review = ${id_review}`
    return dbConnection.execute(query)
}

const createReview = (id_barang,id_user,message,rate,review_at) => {
    const query = `INSERT INTO tbl_review(id_user,id_barang,message,rate,review_at) VALUES (${id_user},${id_barang},'${message}',${rate},'${review_at}')`
    return dbConnection.execute(query)
}

const updateReview = (id_review,message,rate,review_at) => {
    const query = `UPDATE tbl_review SET message='${message}',rate=${rate},review_at='${review_at}' WHERE id_review = ${id_review}`
    return dbConnection.execute(query)
}

const deleteReview = (id_review) => {
    const query = `DELETE FROM tbl_review WHERE id_review = ${id_review}`
    return dbConnection.execute(query)
}

module.exports = {
    getAllItem,
    getSingleItem,
    createItem,
    deleteItem,
    updateItem,
    getAllRentSingleItem,
    getAllReviewSingleItem,
    createReview,
    updateReview,
    deleteReview,
    getSingleReviewById
}