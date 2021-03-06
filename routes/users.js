require('dotenv/config')
var express = require('express');
var router = express.Router();
UserModel = require('../models/user');
MessageModel = require('../models/message');
OrderModel = require('../models/order');
ItemOrderModel = require('../models/item_order');
PersoOrderModel = require('../models/perso_order');
var uid2 = require("uid2"); 
var SHA256 = require("crypto-js/sha256"); 
var encBase64 = require("crypto-js/enc-base64"); 
var dateFormat = function(date){    
	var newDate = new Date(date)    
	var format = newDate.getDate()+'/'+(newDate.getMonth()+1+"/"+newDate.getFullYear())    
	return format  
};  

router.post('/sign-up', async function(req, res, next) {
  var salt = uid2(32); 
  console.log("================ SIGN UP FUNCTION ===============")
  const userExists = await UserModel.findOne({ email: req.body.email})

  if (userExists){
    console.log("USER ALREADY EXISTS, CHANGE EMAIL")
    res.json({userExists})
  } else {
   newUser = new UserModel({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: SHA256(req.body.password+salt).toString(encBase64),
    address: "à renseigner",
    zip_code: "à renseigner",
    city: "à renseigner",
    details:"à renseigner",
    token: uid2(32),
    salt: salt,
    photo: ""
  })

  newUser.save(function(error, user){
    let isUserExists;
    if (user){
    isUserExists = false
    console.log("USER CREATED", user)
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SECRET_SENGRID_KEY);
    const msg={
      to: req.body.email,
      from:"no-reply@mathbrode.com",
      subject: "Bienvenue sur Mathbrode !",
      text:`Bonjour ${req.body.first_name}, et bienvenue sur Mathbrode
      Tu as désormais un compte chez nous. Viens vite nous rendre visite sur Mathbrode.com`,
      html:`<h2> Bonjour ${req.body.first_name} </h2> ! 
      Et bienvenue sur Mathbrode. Tu as désormais un compte chez nous. N'oublie pas de compléter ton adresse avant de passer commande. Viens vite nous rendre visite sur Mathbrode.com`,
    };
    console.log("===================>",msg)

sgMail.send(msg);
console.log("SENT===============================")

        
    res.json({user, isUserExists, userExists})
  }else if (error){
    isUserExists = true
      console.log("USER NOR CREATED:", error)
      res.json({error, isUserExists})
    }
  });
}

})

router.post('/sign-in', async function(req, res, next){
  let thisUser = await UserModel.findOne({email: req.body.email})
  let userExists = await UserModel.findOne({email: req.body.email, password: SHA256(req.body.password + thisUser.salt).toString(encBase64)});

  console.log("USER EXISTS:", userExists)
  let isUserExists;

  if(userExists){
    isUserExists = true;
  } else{
    isUserExists = false;
  }

  res.json({isUserExists, userExists})
})

router.post('/update-info', async function(req, res, next){
  console.log(req.body)
  update = await UserModel.updateOne(
    {_id: req.body.id},
    {first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    address: req.body.address,
    zip_code: req.body.zipcode,
    city: req.body.city,
    details: req.body.details
  })
  thisUser = await UserModel.findOne({_id: req.body.id})
  res.json({thisUser})
})


router.post('/create-message', async function (req, res, next){
  console.log("==================CREATE MESSAGE FUNCTION")
  newMessage = new MessageModel({
    object: req.body.object,
    content: req.body.content,
    user_id: req.body.user_id,
    item_id: req.body.item_id,
    sender_email: req.body.sender_email,
    sender_name: req.body.name,
    date: Date.now(),
    read: false,
    photo: req.body.photo
  })
  
  newMessage.save(function(error, message){
    if(message){
      console.log("MESSAGE SAVED", message)
      const sgMail = require("@sendgrid/mail");
          sgMail.setApiKey(process.env.SECRET_SENGRID_KEY);
          const msg={
            to: "c.rungette@gmail.com",
            from:"no-reply@mathbrode.com",
            subject: "Nouveau message sur Mathbrode",
            text:`Bonjour Mathilde !  
            Tu as reçu un nouveau message sur Mathbrode :
            De ${req.body.sender_name} (${req.body.sender_email}) : <br/>
            ${req.body.content}`,
            html:`<h2> Bonjour Mathilde !</h2>  
            <h3>Tu as reçu un nouveau message sur <a href="http://mathbrode.herokuapp.com/loginadmin"> Mathbrode </a> : <br/>
            De ${req.body.sender_name} (${req.body.sender_email}) : <br/>
            ${req.body.content} </h3>`,
          };
          console.log("===================>",msg)
      
      sgMail.send(msg);
      console.log("SENT===============================")
      
      
      res.json({result:true, newMessage})
    } else{
      console.log("MESSAGE NOT SAVED:", error)
      res.json({error})
    }req.body.email
  });


})

router.post('/order', function (req, res, next){
  console.log("ORDER INFO===================>", req.body)
  Date.prototype.addDays = function(days) {
      this.setDate(this.getDate() + parseInt(days));
      return this;
  };
  var result
  req.body.in_person === 'true' ? result = true : result = false
  console.log("LE RESULTAT:", result)
   var currentDate = new Date();
  newOrder = new OrderModel({
    user_id: req.body.user_id,
    total: req.body.total,
    date: new Date,
    sent: false,
    shipping_date: currentDate.addDays(4),
    in_person: result
  })

  newOrder.save(function(error, order){
    if(order){
      items = JSON.parse(req.body.items)
      console.log("==============> ITEMS", items ) 
      
      for(i=0; i < items.length; i++){
        newItemOrder = new ItemOrderModel({
          item_id: items[i]._id,
          price:items[i].price,
          name: items[i].name,
          order_id: newOrder._id,
          copy: 1,
          photo: items[i].photo,
          description: items[i].description,
        })
        
          newItemOrder.save(function(error, item_order){
            if (error){
              console.log("ERROR:", error)
            } else if (item_order){
              console.log("ITEM_ORDER SAVED:", item_order)
            }
          });
        }

      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SECRET_SENGRID_KEY);
      const msg={
          to: req.body.email,
          from:"no-reply@mathbrode.com",
          subject: "Commande validée",
          text:`Bonjour ${req.body.name},
          Ta commande n° ${newOrder._id} a bien été passée pour un total de ${req.body.total}. La livraison sera prévue le ${dateFormat(newOrder.shipping_date)}. Tu peux retrouver toutes les infos de ta commande dans la partie "Mes commandes". 
          `,
          html:`<h5> Bonjour ${req.body.name}, </h5>
          Ta commande n° ${newOrder._id} a bien été passée pour un total de ${req.body.total}. La livraison sera prévue le ${dateFormat(newOrder.shipping_date)}. Tu peux retrouver toutes les infos de ta commande dans la partie "Mes commandes". 
          `,
        };
            
    sgMail.send(msg);
    

  res.json({order})
} else if (error){
  console.log("ORDER NOT SAVED:", error)
  res.json({error})
}
})

})

router.post('/perso-order', async function(req, res, next){
  var current_date = new Date
  Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

  update = await PersoOrderModel.updateOne(
    {_id: req.body.order},
    {paid: true,
    shipping_date: current_date.addDays(10)})
   
    res.json({update})
})

router.get('/myorders', async function(req, res, next){
  myOrders = await OrderModel.find({user_id: req.query.id })
  myPersoOrders = await PersoOrderModel.find({user_id: req.query.id})
  console.log(myPersoOrders)

  var orderList = [];
  var persoOrderList= [];
  for(let i = 0; i < myOrders.length; i++){ 
    let copyOrder ={_id: myOrders[i]._id, total: myOrders[i].total, date :myOrders[i].date};
    copyOrder.items = await ItemOrderModel.find({order_id: myOrders[i]._id});
    orderList.push(copyOrder);
  }

  console.log("=============>", persoOrderList);
  res.json({myOrders: orderList, myPersoOrders})
})

router.post('/update-photo', async function(req,res){
  console.log(req.body);
  update = await UserModel.updateOne(
      {_id: req.body.id},
      {photo: req.body.photo}
    )
  let photo = req.body.photo
  res.json({photo})
})


module.exports = router;