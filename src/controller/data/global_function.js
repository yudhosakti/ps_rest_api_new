

function formatTanggal(tanggal) {
    // Lakukan pemformatan tanggal di sini, contoh:
    const date = new Date(tanggal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatTanggalPesan(tanggal) {
    const date = new Date(tanggal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2,'0');
    const minnute = String(date.getMinutes()).padStart(2,'0');
    return `${year}-${month}-${day}-${hours}.${minnute}`;
  }

function rentPriceCalculate(tanggal_kembali,tanggal_sewa,harga){
     const kembali = new Date(tanggal_kembali)
     const sewa = new Date(tanggal_sewa)
     
     const millisecondsPerDay = 24 * 60 * 60 * 1000; 

     let calculated = (kembali -sewa)/millisecondsPerDay

     return calculated * harga

  }

  module.exports = {
    formatTanggal,
    rentPriceCalculate,
    formatTanggalPesan
  }