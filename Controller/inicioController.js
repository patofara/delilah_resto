const express = require("express");
const router = express.Router();
const models = require("../routes/models")
var {validacionJwt} = require("../routes/middlewares")


// AGREGAR PRODUCTOS INICIALES
router.post("/productosIniciales", validacionJwt, async (req,res) => {
    if(req.user.isAdmin==false){
        res.send('No está autorizado');
        return
    }
    const productos = await models.Productos.findAll()
    if (productos.length > 0) {
        return res.send('Ya se realizo')
    }
    const newProduct = [{
        nombre:"Hamburguesa",
        descripcion: "200grs Carne Vacuna",
        foto: "https://cocina-casera.com/wp-content/uploads/2016/11/hamburguesa-queso-receta.jpg",
        stock: "100",
        favorito: true,
        precio: "550"
    },{
        nombre : "Papas con Cheddar",
        descripcion:"Papas con cheddar para 2",
        foto: "https://i.pinimg.com/474x/f6/7f/11/f67f11e26a566efe86cfb3dd3c85f9ca.jpg",
        stock: "51",
        favorito: false,
        precio:"470"
    },
    {
        nombre: "Tequeños",
        descripcion: "Bastones de muzzarella",
        foto: "https://www.laylita.com/recetas/wp-content/uploads/2019/03/Tequenos-receta.jpg",
        stock: "0",
        favorito: true,
        precio: "350"
    },{
        nombre:"Tacos",
        descripcion: "Tacos Mexicanos de Carne Vacuna",
        foto:"https://danzadefogones.com/wp-content/uploads/2020/04/Tacos-Veganos-5.jpg",
        stock:"100",
        favorito: false,
        precio: "420"
    }
    
]
    newProduct.forEach (e => {
      models.Productos.create(e)
    });
    res.status(200).json({msj: "Productos creados con exito",newProduct})

    const newEstados =[
        {
            id:1,
            estado: "Nuevo"
        },
        {
            id:2,
            estado: "Confirmado"
        },
        {
            id:3,
            estado: "Preparando"
        },
        {
            id:4,
            estado: "Enviando"
        },
        {
            id:5,
            estado: "Entregado"
        }
]
    newEstados.forEach(e => {
       models.Estados.create(e)
    })
})

// CREA NUEVOS USUARIOS
router.post("/usuariosIniciales", async (req,res) => {
    
    const usuarios = await models.Usuarios.findAll()
    if (usuarios.length > 0) {
        return res.send('Ya se realizo')
    }
    const newUser = [{
        usuario:"pato",
        nombre: "Patricio",
        apellido: "Fara",
        email: "pato@gmail.com",
        telefono: 123456789,
        direccion: "Avenida 123",
        password: "Pato123!!",
        isAdmin: true
    },{
        usuario : "profe",
        nombre:"Evaluador",
        apellido: "Acamica",
        email: "acamica@acamica.com",
        telefono: 987654321,
        direccion:"Calle 52",
        password: "Profe123!!",
        isAdmin: false     
    }
]
    newUser.forEach (e => {
       models.Usuarios.create(e)
    });
    res.status(200).json({msj: "Usuarios creados con exito", "Usuarios":newUser})
})



module.exports = router