require('dotenv/config')
var express = require('express');
var router = express.Router();
EventModel = require('../models/event')
ItemsModel = require('../models/item')
WorkshopModel = require ('../models/workshops')
const stripe = require("stripe")("sk_test_U4Zt16oIOE1MZHl9cC8L7kjE00XOGTYa7j");



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/events', async function(req, res, next){
  allEvents = []
  allPastEvents = []
  currentDate = new Date
  Events = await EventModel.find(function(err, events){
    console.log("OK")
  })  

  for (let i=0; i< Events.length; i++){
    if (Events[i].date >= new Date){
      allEvents.push(Events[i])
    } else if (Events[i].date < currentDate){
      allPastEvents.push(Events[i])
    }
  }

  res.json({result: true, allEvents, allPastEvents})
})

router.get('/items', async function(req, res, next){
  allItems = await ItemsModel.find(function(err, items){
    console.log("créations")
  })
  res.json({allItems})
})

router.get('/items-creations', async function(req, res, next){
  allItems = await ItemsModel.find({first_presentation: true })
  res.json({allItems})
})


router.get('/find-items', async function(req, res, next){
  console.log("in the find item method ==============")
  thisItem = await ItemsModel.findOne({ name: req.query.name})
  console.log(thisItem)

  res.json({thisItem})
})

router.get('/workshops', async function(req, res, next){
  console.log("============= IN THE FIND CLASSES METHOD ==============")
  allWorkshops = await WorkshopModel.find(function(err, workshops){
    console.log(workshops)
  })
  res.json({allWorkshops})
})

router.post("/charge", async (req, res) => {
  console.log("coucou $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
  console.log("=====", req.body);
  
  try {
    let {status} = await stripe.charges.create({
      amount: 2000,
      currency: "eur",
      description: "An example charge",
      source: req.body
    });

    res.json({status});
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});


module.exports = router;