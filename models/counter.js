var mongoose  = require ('mongoose');
var connect=mongoose.connect('mongodb://localhost/UrlShortner');
var db = mongoose.connection;

var counterSchema = mongoose.Schema({
    _id:{type:String,required:true},//A string id
    count:{type:Number}//Counter for no of links
},
    {
        timestamp:true,
        collection:'counters'
    });

var Counter = module.exports = mongoose.model('Counter',counterSchema);
