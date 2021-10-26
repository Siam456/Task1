//internal import
const productModel = require('../model/productModel');

const getData = async (req, res) => {
    try{
        const response = await productModel.find({});

        res.json({
            products: response,
        })


    } catch(err){
        res.status(500).json({
            msg: err.message,
        })
    }
}

const getDataById =  async (req, res) => {
    //console.log(req.params.id)
    try{
        const response = await productModel.find({productID: req.params.id});

        res.json({
            products: response,
        })


    } catch(err){
        res.status(500).json({
            msg: err.message,
        })
    }
}

const postData = async (req, res) => {
    try{
        const product = new productModel(req.body);
        const response = await product.save();

        res.json({
            response,
        })


    } catch(err){
        res.status(500).json({
            msg: err.message,
        })
    }
}

module.exports={ getData, getDataById, postData }