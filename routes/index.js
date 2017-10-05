var express = require('express');
var router = express.Router();
var mongoose  = require('mongoose');
var Link = require('../models/link');
var Counter = require('../models/counter');

var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var base = alphabet.length; // base is the length of the alphabet (58 in this case)
//function to encode the id of the original url
function encode(num){
  var encoded = '';
  while (num){
    var remainder = num % base;
    num = Math.floor(num / base);
    encoded = alphabet[remainder].toString() + encoded;
  }
  return encoded;
}
//Function to decode the id of the shorten url
function decode(str){
  var decoded = 0;
  while (str){
    var index = alphabet.indexOf(str[0]);
    var power = str.length - 1;
    decoded += index * (Math.pow(base, power));
    str = str.substring(1);
  }
  return decoded;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{shortlink:' ',title:''});
});


//adding the url

router.post('/addurl',function(req,res,next){
    var link = req.body.link;//got the link
    var shortlink = ''; //shortlink to be stored
    Link.findOne({link:link},function(doc,err){   /*checking for the link to see whether it already exists in db*/
        if(doc){  //checking for the existence
            shortlink = 'http://localhost:3000/'+encode(doc._id); //encode the id of the url
            res.render('index',{shortlink:shortlink,title:'The short url:-'});
        }
        else{
            var newlink = new Link({
                link:link,
            });
            newlink.save(function(err){
                if(err) throw err;
                shortlink = 'http://localhost:3000/' + encode(newlink._id);
                res.render('index',{shortlink:shortlink,title:'The short url:-'});
            });
        }//else
    });//Url find
    
    
});//end of post method
/*GET BACK THE LONGER URL*/
router.get('/:encoded_id',function(req,res,next){
    var base58_id = req.params.encoded_id;
    var decode58 = decode(base58_id);;
    Link.findOne({_id:decode58},function(err,doc){
        if(doc){
            res.redirect(doc.link);
        }
        else{
            res.redirect('/');
        }
    });
});
module.exports = router;
