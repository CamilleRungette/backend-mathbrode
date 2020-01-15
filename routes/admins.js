var express = require('express');
var router = express.Router();
ItemModel = require('../models/item');
AdminModel = require('../models/admin');
EventModel = require('../models/event');
WorkshopModel = require('../models/workshops')
MessageModel= require('../models/message');
OrderModel = require('../models/order')
ItemOrderModel = require('../models/item_order')
UserModel = require('../models/user')


router.post('/create-admin', function (req, res, next){
    newAdmin = AdminModel({
        name: "Mathilde",
        email: "blabla@gmail.com",
        password: "broderie"
    })

    newAdmin.save(function(error, admin){
        if (error){
            console.log("ADMIN NOT SAVED:", error)
            res.json({error})
        } else if (admin){
            console.log("ADMIN SAVED", admin)
            res.json({admin})
        }
    })

})

router.post('/sign-in', async function(req, res, next){
  console.log(req.body)
    adminExists = await AdminModel.findOne({email: req.body.email, password: req.body.password });
    let isAdminExists;
    console.log(adminExists)

    if(adminExists){
        isAdminExists = true;
    } else if (!isAdminExists) {
        isAdminExists = false
    };
    res.json({isAdminExists, adminExists})
})

router.post('/create-item', async function(req, res, next){
  console.log("============== IN THE CREATE ITEM FUNCTION===========");
  const itemExists = await ItemModel.findOne({name: req.body.name})
  console.log("Item exists:\n", itemExists)

  if(itemExists){
      let message = "Il existe déjà un item avec ce nom."
      console.log("ERROR: Item already exists")
      res.json({message})
  } else{
    newItem = new ItemModel({
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        description: req.body.description,
        shipping_fee: req.body.shipping_fee,
        copy: req.body.copy,
        first_presentation: req.body.first_presentation,
        photo: req.body.photo
    })

    newItem.save(function(error, item){
        if (item){
        console.log("NEW item SAVED:", item)
        }else if (error){
        console.log("item NOT CREATED:", error)
        }
    });
}
allItems = await ItemModel.find(function(err, items){
  console.log(items)
  })
  res.json({allItems})
});

router.get('/stock', async function(req, res, next){
  allItems = await ItemModel.find(function(err, items){
    console.log(items)
    })
  number = await ItemsModel.find({first_presentation: true })
    res.json({allItems, number})
});

router.post('/update-item', async function(req, res, next){
  console.log("IN THE UPDATE METHOD")
  item = await ItemModel.updateOne(
    {_id: req.body.id},
    {name: req.body.name,
    price: req.body.price,
    size: req.body.size,
    description: req.body.desc,
    shipping_fee: req.body.shipping_fee,
    copy: req.body.copy,
    first_presentation: req.body.first_presentation },
    function(error, raw){
    console.log("UPDATE:", raw)
    })
    allItems = await ItemModel.find(function(err, items){
      console.log(items)
      })
    number = await ItemsModel.find({first_presentation: true })

      res.json({allItems, number})
  })

router.post('/delete-item', async function(req, res, next){
  ItemModel.deleteOne(
    {_id: req.body.id},
    function(error){
    });
    allItems = await ItemModel.find(function(err, items){
      console.log(items)
      })
    res.json({allItems})
  })

router.post('/create-event', function(req, res, next){
  console.log("=====================CREATE-EVENT FUNCTION=========")
    newEvent = new EventModel({
      name: req.body.name,
      address: req.body.address,
      date: req.body.date,
      photo: req.body.photo,
      starting_time: req.body.starting_time,
      ending_time: req.body.ending_time,
      link: req.body.link
    });

    newEvent.save(function(error, event){
      if(error){
        console.log("ERREUR:", error);
      }else if (event){
        console.log("EVENT SAVED IN DATABASE", event)
        res.json({event})
      }
    });
})


router.get('/messages', async function(req, res, next){
  allMessages = await MessageModel.find(function(err, messages){
    console.log(messages)
  })

  res.json({allMessages})
})

router.post('/read-message', async function (req, res, next){
  console.log(req.body)
  message = await MessageModel.findOne({_id: req.body.message_id})
  if (message.read == false){
    update = await MessageModel.updateOne(
      {_id: req.body.message_id},
      {read: true})
    } else if (message.read == true){
      update = await MessageModel.updateOne(
        {_id: req.body.message_id},
        {read: false})
      }
    newMessage = await MessageModel.findOne({_id: req.body.message_id})
  res.json({newMessage})
})

router.post('/delete-message', async function(req, res, next){
    console.log("in the delete message method")
  message = await MessageModel.findOne({_id: req.body.message_id})
    console.log(message)
  MessageModel.deleteOne(
    {_id: req.body.message_id},
    function(error) {
    });
    messages = await MessageModel.find(function(err, orders){
      console.log("messages")
    })
  res.json({messages})
    console.log("message deleted")
})

router.post('/create-workshop', function(req, res, next){
  console.log("=====================CREATE-WORKSHOP FUNCTION=========")
    newWorkshop = new WorkshopModel({
      title: req.body.title,
      desc: req.body.desc,
      price: req.body.price,
      duration: req.body.duration,
      photo: "https://res.cloudinary.com/dduugb9jy/image/upload/v1576163613/camille/diizhinpqeiouhwenbdj.jpg"
    });

    newWorkshop.save(function(error, workshop){
      if(error){
        console.log("ERREUR:", error);
      }else if (workshop){
        console.log("WORKSHOP SAVED IN DATABASE", workshop)
        res.json({workshop})
      }
    });
})
router.get('/orders', async function(req, res, next){
  allOrders = await OrderModel.find(function(err, orders){
    console.log(orders)
  })
  res.json({allOrders})
})

router.get('/order', async function(req, res, next){
  thisOrder = await OrderModel.findOne({_id: req.query.id})
  thisUser = await UserModel.findOne({_id: thisOrder.user_id})
  console.log(thisUser)
  items = await ItemOrderModel.find({order_id: thisOrder._id})
    console.log("================> ITEMS", items)
  res.json({thisOrder, thisUser, items})
})

router.post('/update-order', async function(req, res, next){
  console.log("================>", req.body.order)
  update = await OrderModel.updateOne(
    {_id: req.body.order},
    {sent: true}
    )
  allOrders = await OrderModel.find(function(err, orders){
    console.log(orders)
  })
    res.json({allOrders})
})


module.exports = router;