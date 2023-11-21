const  {Schema,model} = require("mongoose");
const schema = new Schema({
        "email":{
        "required":true,
        'type':String
        },
        "password":{
        'type':String
        }
    });
module.exports = model('logindata',schema);;
