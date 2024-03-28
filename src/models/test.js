const dbConnection = require('../config/database')
const getCustomResponse = () => {

    const query = 'SELECT * FROM tescase INNER JOIN test ON tescase.id_testku = test.id_test ORDER BY test.id_test';
    return dbConnection.execute(query);
}




module.exports = {
    getCustomResponse
}

