var express = require('express');
var router = express.Router();
let { Op } = require("sequelize");
let { User, Category, Thread, Reply } = require('../models');

router.post('/category', async function(req, res, next) {
    let category= await Category.create(req.body);
    res.json(category);
})

router.get('/category', async function(req, res, next) {
    let categories= await Category.findAll();
    res.json(categories);
})

router.get('/thread', async function(req, res, next) {
    let threads = await Thread.findAll({include: [User]});
    res.json(threads);
})

router.get('/thread/:id', async function(req, res, next) {
    let thread = await Thread.findAll({where:{id:req.params.id}, include: [User]});
    res.json(thread);
})

router.get('/category/:id/threads', async function(req, res, next) {
    let threads = await Thread.findAll({where: {CategoryId:req.params.id}, include: [User]})
    res.json(threads);
});

router.post('/category/:id/threads', async function(req, res, next) {
    let thread = await Thread.create(req.body);
    res.json(thread);
});

router.get('/thread/:id/replies', async function(req, res, next) {
    let replies = await Reply.findAll({where: {ThreadId:req.params.id}, include: [User]})
    res.json(replies);
});

router.post('/thread/:id/replies', async function(req, res, next) {
    let reply = await Reply.create(req.body);
    res.json(reply);
});

router.get('/test', async function(req, res, next){
    if (req.isAuthenticated){
        res.status(200).send('here is the data');
    } else {
        res.status(401).send('you are not login user')
    }
})




module.exports = router;
