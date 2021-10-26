const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}))
require('dotenv').config();

//database connection
mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING,
    {   useNewUrlParser: true,
        //useCreateIndex: true,
        useUnifiedTopology: true,})
        //useFindAndModify: true })
.then(() => console.log('connection successfully'))
.catch(err => console.log(err));

//internal import
const { getData, getDataById, postData } = require('./controller/controller');

const route = express.Router();


route.get('/', getData);
route.get('/:id', getDataById);
route.post('/', postData);
app.use('/api', route);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server Start Successfully on port ${process.env.PORT}`);
})