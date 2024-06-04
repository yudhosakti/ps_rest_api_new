

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

  function dayCalculated(tanggal_kembali,tanggal_sewa) {
    const kembali = new Date(tanggal_kembali)
     const sewa = new Date(tanggal_sewa)
     
     const millisecondsPerDay = 24 * 60 * 60 * 1000; 

     let calculated = (kembali -sewa)/millisecondsPerDay

     

     return calculated 
  }

  function formatMySQLTimestamp(dateNow) {
  const date = new Date(dateNow)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getDateNow() {
  const timeNow = new Date();

  const year = timeNow.getFullYear();
  const month = String(timeNow.getMonth() + 1).padStart(2, '0'); 
  const day = String(timeNow.getDate()).padStart(2, '0'); 
  
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate
}

function getDateTimeNow() {
  const timeNow = new Date();

const year = timeNow.getFullYear();
const month = String(timeNow.getMonth() + 1).padStart(2, '0'); 
const day = String(timeNow.getDate()).padStart(2, '0'); 
const hours = String(timeNow.getHours()).padStart(2, '0');
const minutes = String(timeNow.getMinutes()).padStart(2, '0');
const seconds = String(timeNow.getSeconds()).padStart(2, '0');
const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
return formattedDateTime;
}



  module.exports = {
    formatTanggal,
    rentPriceCalculate,
    formatTanggalPesan,
    formatMySQLTimestamp,
    getDateNow,
    getDateTimeNow,
    dayCalculated
  }