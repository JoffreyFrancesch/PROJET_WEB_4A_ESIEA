var express = require('express');
var router = express.Router();
var fs = require('fs');

var stockServer, cartServer, users;

fs.readFile('stock.json', (err,data)=>{
    if(err){
        console.log(err);
    } else {
        stockServer = JSON.parse(data)
    }
})

fs.readFile('cart.json', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        cartServer = JSON.parse(data)
    }
})

fs.readFile('users.json', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        users = JSON.parse(data)
    }
})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/myStock', (req, res) => {
    console.log(JSON.stringify(users))
    res.json(stockServer)
});

router.get('/myCart', (req, res) => {
    res.json(cartServer)
});


router.post('/myCart', (req, res) => {
    var id = req.body.id;
    if (stockServer[id].quantity >= 1) {
        cartServer[id].quantity += 1;
        stockServer[id].quantity -= 1;
        fs.writeFile("stock.json", JSON.stringify(stockServer), err => {
            if (err) {
                console.log(err)
            } else {
                console.log("Stock saved")
            }
        })
        res.status(200).send("OK");
    } else {
        res.send("L'article n'est pas en stock");
    }
})

router.post('/myStock', (req,res) =>{
    var id = req.body.id;
    console.log('id', id)
    if(cartServer[id].quantity >= 1){
        cartServer[id].quantity -= 1;
        stockServer[id].quantity += 1;
        fs.writeFile("stock.json", JSON.stringify(stockServer), err => {
            if (err) {
                console.log(err)
            } else {
                console.log("Stock saved")
            }
        })
        res.status(200).send("OK");
    } else {
        res.send("L'item n'était pas dans le panier");
    }
})


router.post('/createUser', (req, res) => {
    users.push({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        date: req.body.date,
        email: req.body.email,
        password: req.body.password
    })
    fs.writeFile("users.json", JSON.stringify(users), err => {
        if(err){
            console.log(err)
        } else {
            console.log("User saved")
        }
    })
    res.status(200).send('User enregistré');
})

router.post('/login', (req,res) =>{
    var user = req.body.email;
    var password = req.body.password;
    users.forEach(item =>{
        if(item.email === user && item.password === password){
            res.status(200).send("OK");
        } else {
            res.send("Uttilisateur inconnu");
        }
    })

})

module.exports = router;