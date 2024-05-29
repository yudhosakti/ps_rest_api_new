const globalFunction = require('./global_function')
const serviceProccesData = (data) => {
    let dataFinal = []
    let dataUserTemp = []
    let idTemp = 0

    for (let index = 0; index < data.length; index++) {
        if (idTemp == 0) {
            idTemp = data[index].id_cs
        }
        if (index+1 >= data.length) {
            if (idTemp == data[index].id_cs) {
                dataUserTemp.push({
                    id_user: data[index].id_user,
                    id_member: data[index].id_member,
                    name: data[index].name,
                    avatar: data[index].avatar,
                    role: data[index].role
                })
              
                dataFinal.push({
                    id_cs: data[index].id_cs,
                    users: dataUserTemp,
                    last_message: data[index].last_message,
                    update_at: globalFunction.formatTanggalPesan(data[index].update_at) 
                })
                break
                
            } else {
                dataFinal.push({
                    id_cs: data[index].id_cs,
                    users: dataUserTemp,
                    last_message: data[index].last_message,
                    update_at: globalFunction.formatTanggalPesan(data[index].update_at)
                })
                dataUserTemp = []
                dataUserTemp.push({
                    id_user: data[index].id_user,
                    id_member: data[index].id_member,
                    name: data[index].name,
                    avatar: data[index].avatar,
                    role: data[index].role
                })
                dataFinal.push({
                    id_cs: data[index].id_cs,
                    users: dataUserTemp,
                    last_message: data[index].last_message,
                    update_at: globalFunction.formatTanggalPesan(data[index].update_at)
                })
            }
            
        }else if(idTemp != data[index+1].id_cs){

            dataUserTemp.push({
                id_user: data[index].id_user,
                id_member: data[index].id_member,
                name: data[index].name,
                avatar: data[index].avatar,
                role: data[index].role
            })
            dataFinal.push({
                id_cs: data[index].id_cs,
                users: dataUserTemp,
                last_message: data[index].last_message,
                update_at: globalFunction.formatTanggalPesan(data[index].update_at)
            })
            dataUserTemp = []
            idTemp = data[index+1].id_cs

        } 
        else {
            dataUserTemp.push({
                id_user: data[index].id_user,
                id_member: data[index].id_member,
                name: data[index].name,
                avatar: data[index].avatar,
                role: data[index].role
            })
        }
       

    }
    return dataFinal
}

module.exports = {
    serviceProccesData
}