Vue.component('modal', {
    template: '#modal-template',
    data : () => ({
        newUser: {
            firstName: '',
            lastName: '',
            date: '',
            email: '',
            password: ''
        },
        userTemp: {
            email: '',
            password: '',
        }
    }),
    methods : {
        addUser : function (){
            console.log('addUser')
            this.$emit('adduser', this.newUser);
        },
        logUser : function (){
            console.log('LogUser')
            this.$emit('loguser', this.userTemp);
        }
    }
});

Vue.prototype.$http = axios;

const app = new Vue({
    el: "#app",
    data: {
        currentPage: "menu",
        showModal: false,
        stockClient: [],
        cartClient: [],
        user : {
            email : ''
        }
    },
    methods: {
        addToCart: function (index) {
            this.$http.post('/myCart', {
                    id: this.stockClient[index].id
                })
                .then((response) => {
                    if (response.data === "OK") {
                        this.cartClient[index].quantity += 1;
                        this.stockClient[index].quantity -= 1;
                    } else {
                        alert(response.data);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        //fonction de changement du text si le produit n'est plus en stock
        textChange: function (index) {
            if (this.stockClient[index].quantity === 0) {
                this.stockClient[index].btn = "Victime de son succes";
            }
            if (this.stockClient[index].quantity >= 1) {
                this.stockClient[index].btn = "Ajoutez au panier";
            }
        },
        // calcul le total prix total de chaque article en fonction du nb demandé
        semiTotal: function (index) {
            return this.cartClient[index].quantity * this.cartClient[index].price;
        },
        // supprime l'article du panier si nous le souhaitons
        deleteItem: function (index) {
            this.$http.post('/myStock', {
                    id: this.cartClient[index].id,
                })
                .then((response) => {
                    if (response.data === "OK") {
                        this.cartClient[index].quantity -= 1;
                        this.stockClient[index].quantity += 1;
                    } else {
                        alert(response.data)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        onAddUser: function (newUser) {
            
            this.$http.post('/createUser', {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                date: newUser.date,
                email: newUser.email,
                password: newUser.password
            })
            .then((response) => {
                this.user.email = newUser.email
                alert(response.data);
            })
        },
        onLogUser: function (user) {
            this.$http.post('/login', {
                email : user.email,
                password : user.password
            })
            .then((response) => {
                if(response.data === "OK"){
                    this.user.email = user.email
                    console.log("Connecte")
                } else {
                    alert(response.data);
                }
            })
        },
        paiement: function (){
            var total = 0;
            this.cartClient.forEach(element => {
              total += element.quantity * element.price;
            });
            if(this.user.email != ''){
                if(total != 0){
                    alert("Paiement réussi");
                } else {
                    alert("Panier vide");
                }
            
            } else {
                alert("Veuillez vous connectez");
            }
        },
    },
    computed: {
        // simple fonction de calcul du montant total de tout les articles du panier
        totalCart: function () {
            var sum = 0;
            this.cartClient.forEach(element => {
                sum += element.quantity * element.price;
            });
            return sum;
        }
    },
    created() {
        this.$http.get('/myStock')
            .then((response) => {
                console.log('reponse du stock serveur', response.data)
                this.stockClient = response.data;
            });
        this.$http.get('myCart')
            .then((response) => {
                console.log("reponse du panier serveur", response.data);
                this.cartClient = response.data;
            });
    }
});