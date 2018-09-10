// component pour le modal uttilisé pour le login
Vue.component("modal", {
  template: "#modal-template",
  data: () => ({
    // object contenant toute les infos d'un nouvel user
    newUser: {
      firstName: "",
      lastName: "",
      date: "",
      email: "",
      password: ""
    },
    // object contennt les infos pour un user connu
    userTemp: {
      email: "",
      password: ""
    }
  }),
  methods: {
    // fonction qui permet d'appeler la fonction pour ajouter un user
    addUser: function() {
      console.log("addUser");
      this.$emit("adduser", this.newUser);
    },
    // fonction qui permet d'appeler la fonction pour connecter un user
    logUser: function() {
      console.log("LogUser");
      this.$emit("loguser", this.userTemp);
    }
  }
});

Vue.prototype.$http = axios;

const app = new Vue({
    el: "#app",
    data: {
        currentPage: "menu",
        showModal: false,
        stockClient: [], // liste stock cote client
        cartClient: [], // liste panier cote client
        user : { // retiens l'email du user pour l'afficher
            email : ''
        }
    },
    methods: {
        // function pour ajouter au panier Local et informer le serveur
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
        // calcul le total prix total de chaque article en fonction du nb demandé
        semiTotal: function (index) {
            return this.cartClient[index].quantity * this.cartClient[index].price;
        },
        // supprime l'article du panier si nous le souhaitons et informe le serveur
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
        // ajoute un compte uttilisateur et le transmet a l'uttilisateur
        onAddUser: function (newUser) {
            if(newUser.firstName != '' && newUser.lastName != '' && newUser.date != '' && newUser.date != '' && newUser.email != '' && newUser.password != ''){
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
            } else {
                alert('Il manque des infos...');
            }
        },
        // connexion d'un uttilisateur connu
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
        // réalise un paiement fictif pour montrer que cela fonctionne bien
        paiement: function (){
            var total = 0;
            this.cartClient.forEach(element => {
              total += element.quantity * element.price;
            });
            if(this.user.email != ''){
                if(total != 0){
                    alert("Paiement réussi : le compte FRXX XXXX XXXX XXXX XXX 87 sera bien débité de la somme de " + this.total + " € ");
                } else {
                    alert("Le panier est vide, le compte FRXX XXXX XXXX XXXX XXX 87 ne sera donc pas débité");
                }
            } else {
                alert("Veuillez vous connectez pour procéder au paiement");
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
        // récupère la liste des stocks du serveur
        this.$http.get('/myStock')
            .then((response) => {
                console.log('reponse du stock serveur', response.data)
                this.stockClient = response.data;
            });
        // récupère la liste pour le paienr du serveur
        this.$http.get('myCart')
            .then((response) => {
                console.log("reponse du panier serveur", response.data);
                this.cartClient = response.data;
            });
    }
});