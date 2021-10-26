const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    productID: {
        type: Number,
        require: true,
    },
    despription: {
        type: String,
        require: true,
    },
    CD: {
        type: Number,
        require: true,
    },
    SD: {
        type: Number,
        require: true,
    },
    VAT: {
        type: Number,
        require: true,
    },
    RD: {
        type: Number,
        require: true,
    }
},
{
    timestamps: true,
});

const productModel = mongoose.model('product', Schema);

module.exports = productModel;