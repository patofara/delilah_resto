const app = require("./routes/app")
require('dotenv').config()
const db = require("./routes/models")

const personasController = require("./Controller/personasController")
app.use("/users", personasController);

const productodController = require("./Controller/productosController")
app.use("/productos", productodController)

const pedidosController = require("./Controller/pedidosController")
app.use("/pedidos", pedidosController)


//ASSOCIATIONS
db.Users.hasMany(db.Pedidos)
db.Pedidos.belongsTo(db.Users)

db.Pedidos.hasMany(db.Detalle_Pedidos)
db.Detalle_Pedidos.belongsTo(db.Pedidos)





