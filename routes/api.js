var express = require('express');
var router = express.Router();
let { Op } = require("sequelize");
let { User, Category, Thread, Reply } = require('../models');


router.get('/category/:id/threads', async function(req, res, next) {
    let threads = await Thread.findAll({where: {CategoryId:req.params.id}})
    res.json(threads);
});

router.post('/category/:id/threads', async function(req, res, next) {
    let thread = await Thread.create(req.body);
    res.json(thread);
});

router.get('/thread/:id/replies', async function(req, res, next) {
    let replies = await Reply.findAll({where: {ThreadId:req.params.id}})
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
