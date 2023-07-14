var express = require('express');
var router = express.Router();
const Order = require('../models/Order');

/////Add order
router.post('/addorder', (req, res, next) => {

    const newOrder = new Order({
        user: req.body.user,
        product: req.body.product
    })

    newOrder.save().then(doc => {
        res.status(200).json({
            message: doc
        })

    }).catch(error => {
        res.status(404).json({
            message: error
        })
    })
});
////////

//////get All Orders
router.get('/', (req, res, next) => {
    Order.find().populate('user', 'username')
        .then(orders => {
            res.status(200).json({
                message: orders
            })
        }).catch(error => {
            res.status(404).json({
                message: error
            })
        })
});
///////////

//////update Order
router.patch('/updateOrder/:orderID', (req, res, next) => {

    var newProduct = req.body.product;

    Order.findById({ _id: req.params.orderID })
        .then(doc => {
            var oldProduct = doc.product
            console.log('Old Product : '+doc.product)

            for (var indexOfNewProduct = 0; indexOfNewProduct < newProduct.length; indexOfNewProduct++) {
                for (var indexOfOldProduct = 0; indexOfOldProduct < oldProduct.length; indexOfOldProduct++) {
                    if (newProduct[indexOfNewProduct]._id === oldProduct[indexOfOldProduct]._id) {
                        oldProduct[indexOfOldProduct].quantity = Number(oldProduct[indexOfOldProduct].quantity) + Number(newProduct[indexOfNewProduct].quantity);
                        newProduct.splice(indexOfNewProduct, 1);

                        break;
                    }
                }

            }


            oldProduct = oldProduct.concat(newProduct);
            console.log(newProduct);
            console.log(oldProduct)

            const newOrder = {
                product: oldProduct
            }

            Order.update({ _id: req.params.orderID }, { $set: newOrder })
                .then(doc => {
                    res.status(202).json({
                        message: doc
                    })
                })
                .catch(error => {
                    res.status(404).json({
                        message: error
                    })
                })

        })
        .catch(error => {
            res.status(404).json({
                message: error
            })
        })


});
/////////////

module.exports = router;