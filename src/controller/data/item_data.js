const fs = require('fs')

function deleteImage (imageURL,value){
    const [data] = value
           if (imageURL != '' && (data[0].gambar_barang != '' || data[0].gambar_barang != null)) {
               let path = data[0].gambar_barang
               const separated = path.split(host.local)
               fs.unlink(separated[1],(err) => {
                   if (err) {
                     console.log(err)
                   }else{
                    console.log("Berhasil Hapus")
                   }
               })
           }
}

module.exports = {
    deleteImage
}