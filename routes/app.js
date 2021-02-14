const express = require("express");
const app = express();
const cors = require("cors"); 
const db = require("./conexion")
const models = require("./models")

app.use(express.json())
app.use(cors());

db.init()
    .then(async () => {

        db.sequelize.sync({force:false}).then(()=>{
            console.log("Database Connected Succesfull…");
        }).catch(err=>{
        console.log(err);
        });
        console.log('Conectado a la Base de Datos');
        app.set("port", process.env.PORT || 3000);
        app.listen(app.get("port"), () => {
            console.log("Server on port", app.get("port"))
        })

    }).catch((err) => {
        console.log('Error al conectar a la db', err);
    });


module.exports = app;