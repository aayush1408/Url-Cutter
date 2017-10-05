var mongoose  = require ('mongoose');
var connect=mongoose.connect('mongodb://localhost/UrlShortner');//Creating database
var db = mongoose.connection;
var counterSchema = require('./counter');

var linkSchema = mongoose.Schema({
    _id:{type:Number},
    link:{type:String}
},{
    timestamp:true,
    collection:'links'
});

linkSchema.pre('save',function(next){
     var link = this;
     counterSchema.findByIdAndUpdate({_id:'url_count'},
            { $inc: { count: 1 } }, { new: true, upsert: true }, function(err, counter){
        if(err) return next(err);
        link._id = counter.count;
        next();
    }); 
})
module.exports = mongoose.model('Link', linkSchema);
