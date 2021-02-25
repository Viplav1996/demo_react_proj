var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishList');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/product', function(req, res) {
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.save(function(err, saveProduct){
        if (err) {

            res.status(500).send({error: "Could not save product"});

        } else {
            res.send(saveProduct);
        }
    })
});

app.get('/product', function(req,res){

    Product.find({}, function(err, products){
        if (err) {
            res.status(500).send({error:"Couldnt fetch products"});
        } else {
            res.send(products);
        }
    });
});

app.get('/wishlist', function(req, res){
    WishList.find({}).populate({path:'products', model:'Product'}).exec(function(err, wishLists)
    {
        if (err) {
            res.status(500).send({error: "Could not fetch wishlists"});
        } else {
            res.status(200).send(wishLists);
        }
    })
});

app.post('/wishlist', function(req, res){
    var wishList = new WishList();
    wishList.title = req.body.title;

    wishList.save(function(err, newWishList){
        if (err){
            res.status(500).send({error: "Couldn't create wishlist"});
        } else {
            res.send(newWishList);
        }
    });
});

// ADDING NEW PRODUCT

app.put('/wishlist/product/add', function(req, res){
    Product.findOne({_id: req.body.productId}, function(err, product){
        if (err) {
            res.status(500).send({error:"Could not add item to wishlist"});
        } else {
            WishList.updateMany({_id:req.body.wishListId}, {$addToSet:{products: product._id}}, function(err, wishList){
                if (err) {
                    res.status(500).send({error:"Could not add item to wishlist"});
                } else {
                    res.send("Successfully added to wish list");
                }
            });
        }
    });
});


app.listen(3000, function (){
    console.log("Swag shop API running on port 3000...!!!");
});
