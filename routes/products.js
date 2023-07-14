var express = require('express');
var router = express.Router();
const Product = require('../models/product');


router.get('/', (req, res, next) => {
    //get All products from db
    Product.find().select('_id name price description size')
        .then(doc => {

            const response = {
                doc: doc.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        quantity: doc.quantity,
                        _id: doc._id,
                        description: doc.description,
                        size: doc.size,
                        uri: {
                            type: 'GET',
                            urls: 'localhost:3000/products/product/' + doc._id
                        }
                    }
                })

            }
            console.log(doc);
            res.status(200).json({
                products: response
            })
        })
        .catch(error => {
            res.status(404).json({
                message: error
            })
        })
});

////add product

router.post('/addproduct', (req, res, next) => {

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        size: req.body.size,
        quantity: req.body.quantity
    });

    product.save().then(result => {
        res.status(200).json({
            message: 'Product Added'
        })
    })
        .catch(error => {
            res.status(404).json({
                message: error
            })
        });

});
///////////

/////find Product

router.get('/product/:productID', (req, res, next) => {
    Product.findById(req.params.productID).then(selectedProduct => {
        res.status(200).json({
            name: selectedProduct.name,
            price: selectedProduct.price,
            description: selectedProduct.description,
            size: selectedProduct.size,
            quantity: selectedProduct.quantity
        })
    })
        .catch(error => {
            res.status(404).json({
                message: error
            })
        })
});
//////////////


///////update product
router.patch('/:productID', (req, res, next) => {

    const newProduct = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        size: req.body.size,
        quantity: req.body.quantity
    };

    Product.findByIdAndUpdate(req.params.productID, { $set: newProduct })
        .then(result => {
            res.status(202).json({
                message: result
            });
        })
        .catch(error => {
            res.status(404).json({
                message: error
            });
        })

});
//////////////


///////delete product
router.delete('/:productID', (req, res, next) => {

    Product.deleteOne({ _id: req.params.productID }).then(result => {
        res.status(200).json({
            message: "Product deleted"
        })
    }).catch(error => {
        res.status(404).json({
            message: error
        })
    })
});

////////////////


module.exports = router;
