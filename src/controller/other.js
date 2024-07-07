const host = require('../config/host_local')

const uploadImage = async(req,response) => {
    console.log(req.file)
    let imageURl = ''
    try {
        if (req.file) {
            imageURl = host.local+req.file.path.replace(/\\/g, '/');
            console.log(imageURl)
        }

        response.json({
            data: {
                url: imageURl
            }
        })
    } catch (error) {
        response.status(500).json({
            message: "Error"
        })
    }
   
}

module.exports = {
    uploadImage
}