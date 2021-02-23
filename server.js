const app = require("./routes/app")
require('dotenv').config()
const db = require("./routes/models")

const personasController = require("./Controller/personasController")
app.use("/usuarios", personasController);

const productodController = require("./Controller/productosController")
app.use("/productos", productodController)

const pedidosController = require("./Controller/pedidosController")
app.use("/pedidos", pedidosController)

const inicioController = require("./Controller/inicioController")
app.use("/inicio", inicioController)


//ASSOCIATIONS
db.Usuarios.hasMany(db.Pedidos)
db.Pedidos.belongsTo(db.Usuarios)

db.Pedidos.hasMany(db.Detalle_Pedidos)
db.Detalle_Pedidos.belongsTo(db.Pedidos)

db.Estados.hasMany(db.Pedidos)
db.Pedidos.belongsTo(db.Estados)



