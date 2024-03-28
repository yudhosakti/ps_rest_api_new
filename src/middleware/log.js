const logRequest = (req,response,next)=> {
    console.log('log req',req.path);
    next();
}

module.exports = {
    logRequest
}