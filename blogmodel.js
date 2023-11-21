const  {Schema,model} = require("mongoose");
    const schema = new Schema({
            "id":{
                'type':String,
                'required':true
            },
            "title":{
                'type':String,
            },
            "description":{
                'type':String,
            }
        });
    module.exports = model('blog',schema);;
    