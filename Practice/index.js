import express from 'express';
import router from './Routes/routes.js';
import multer from 'multer';
// const express = require('express');
import { store } from './config/multer.js';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();
app.use(cookieParser());
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false
}))

const upload = multer({
    storage: store,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

await connectDB();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(upload.single('image'));

app.get('/', (req, res) => {
    // res.cookie('name', '12341234')
    // console.log(req.cookies);
    // if (req.session.page_views) {
    //     req.session.page_views++;
    //     res.send(`Your count is ${req.session.page_views} times`);
    // } else {
    //     req.session.page_views = 1;
    //     res.send(`Your count is ${req.session.page_views} times`);
    // }
    res.send('Welcome to express server!');
})

app.use('/user', router);

app.listen(5000, () => {
    console.log('server is running on port 5000');
})