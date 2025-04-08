const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const registrationRouter = require('./routes/registration/users');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 5000

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('dotenv').config();


// DB connection
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
        }).then(()=> {
        console.log("Successfully Connected to the Database")
    }).catch((err) =>{
        console.log(err);
    });

app.use('/', indexRouter);
app.use('/registration', registrationRouter);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)});

