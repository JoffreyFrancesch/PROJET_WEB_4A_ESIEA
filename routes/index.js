var express = require('express');
var router = express.Router();
var fs = require('fs');

var stockServer, cartServer, users;

//lis le ficheir stock.json pour charger la liste
fs.readFile('stock.json', (err,data)=>{
    if(err){
        console.log(err);
    } else {
        stockServer = JSON.parse(data)
    }
})

//lis le ficheir cart.json pour charger la liste
fs.readFile('cart.json', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        cartServer = JSON.parse(data)
    }
})

//lis le ficheir users.json pour charger la liste
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

// GET stock list
// route pour envoyer la liste stockServer au client quand il la demande
router.get('/myStock', (req, res) => {
    console.log(JSON.stringify(users))
    res.json(stockServer)
});

//GET cart list
// route pour envoyer la liste cartServer au client quand il la demande
router.get('/myCart', (req, res) => {
    res.json(cartServer)
});

// POST cart list
// route pour recuperer les valeur à traiter pour la liste cartServer
router.post('/myCart', (req, res) => {
    var id = req.body.id;
    if (stockServer[id].quantity >= 1) {
        cartServer[id].quantity += 1;
        stockServer[id].quantity -= 1;
        // ecrire la nouvelle valeur dans le stock.json
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

// POST stock list
// route pour recuperer les valeur à traiter pour la liste serverStock
router.post('/myStock', (req,res) =>{
    var id = req.body.id;
    console.log('id', id)
    if(cartServer[id].quantity >= 1){
        cartServer[id].quantity -= 1;
        stockServer[id].quantity += 1;
        // ecrire la nouvelle valeur dans le stock.json
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

// POST create user
// route pour recuperer les valeurs à traiter pour creer un user
router.post('/createUser', (req, res) => {
    users.push({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        date: req.body.date,
        email: req.body.email,
        password: req.body.password
    })
    // enregistre le nouvel user dans users.json
    fs.writeFile("users.json", JSON.stringify(users), err => {
        if(err){
            console.log(err)
        } else {
            console.log("User saved")
        }
    })
    res.status(200).send('User enregistré');
})

// POST Login
// route pour recuperer les valeurs pour valider l'authentification
router.post('/login', (req,res) =>{
    var user = req.body.email;
    var password = req.body.password;
    // parcous le tableau des users
    users.forEach(item =>{
        //validation du l'authentification si l'email et le password corresponde bien
        if(item.email === user && item.password === password){
            res.status(200).send("OK");
        } else {
            res.send("Uttilisateur inconnu");
        }
    })

})

module.exports = router;