var express = require('express');
var router = express.Router();
let { Op } = require("sequelize");
let { User, Category, Thread, Reply } = require('../models');

router.post('/registration', async function(req, res, next) {
    if (req.body.userName && req.body.email && req.body.password) {
        const user = await User.create(req.body);
        res.json(user);
    } 
});



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


// router.get('/', async function(req, res, next) {
//   if (req.query.firstName && req.query.lastName) {
//     let user = await Users.findAll({where: {
//       firstName: req.query.firstName,
//       lastName: req.query.lastName
//     }})
//     res.json(user);
//   }
//   else {
//     res.send('respond with a resource');
//   }
  
// });

// router.get('/:id', async function(req, res, next) {
//   let user = await Users.findAll({where:{id:req.params.id}})
//   res.json(user);
// });

// router.post('/', async function(req, res, next) {
//   const user = await Users.create(req.body);
// });

// router.put('/:id', async function(req, res, next) {
//   const user = await Users.update(req.body, {
//     where:{ 
//       id: req.params.id
//     }
//     });
// });

module.exports = router;
