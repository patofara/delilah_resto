const app = require("./routes/app")
require('dotenv').config()

const personasController = require("./Controller/personasController")
app.use("/users", personasController);

const productodController = require("./Controller/productosController")
app.use("/productos", productodController)

const pedidosController = require("./Controller/pedidosController")
app.use("/pedidos", pedidosController)








