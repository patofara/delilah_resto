const express = require("express");
var {verificarProducto,validacionJwt} = require("../routes/middlewares")
const router = express.Router();
const models = require("../routes/models")
const PRODUCTOS = models.Productos


// AGREGAR PRODUCTOS DE A 1
// BODY => stock = "INTEGER" - favorito: BOOLEAN
router.post("/", validacionJwt ,verificarProducto, async (req,res) => {
    if(req.user.admin==="false"){
        res.send('No está autorizado');
        return
    }
    const {nombre,descripcion,foto,stock,favorito,precio} = req.body
    const newProduct = {
        nombre,
        descripcion,
        foto,
        stock,
        favorito,
        precio
    }
    const product = await PRODUCTOS.create(newProduct)
    if(product) return res.status(200).json(product) 
    return res.status(200).json({error : "No se pudo crear el producto..."}) 
})

// CONSULTAR TODOS LOS PRODUCTOS
router.get("/", async (req,res) => {
    const consulta = await PRODUCTOS.findAll()
    if(consulta) return res.status(200).json(consulta) 
    return res.status(200).json({error : "No se pudo realizar la consulta..."})
})

// CONSULTAR PRODUCTO POR ID
router.get("/:id", async (req,res) => {
    const findProduct = await PRODUCTOS.findOne({
        where : {id: req.params.id}
    });
    console.log(findProduct);
    if(findProduct) return res.status(200).json(findProduct)
    return res.status(400).json({error : "No se encontro ID..."})
})

// ACTUALIZAR UN PRODUCTO POR ID
router.put("/:id", validacionJwt, async (req,res) =>{
    if(req.user.admin==="false"){
        res.send('No está autorizado');
        return
    }
    const actualizarProducto = await PRODUCTOS.update(req.body,{
        where : {id: req.params.id}
    });
    console.log(actualizarProducto);
    if(actualizarProducto[0]) return res.status(200).json({exito: "Acutalizado con exito..."})
    return res.status(400).json({error : "No se encontro ID..."})
})

// BORRAR PRODUCTO POR ID
router.delete("/:id", validacionJwt, async (req,res) =>{
    if(req.user.admin==="false"){
        res.send('No está autorizado');
        return
    }
    const deleteProduct = await PRODUCTOS.destroy({
        where : {id: req.params.id}
    });
    if(deleteProduct) return res.status(200).json({exito: "Borrado con exito..."})
    return res.status(400).json({error : "No se encontro ID..."})
})


// AGREGAR PRODUCTOS INICIALES
router.post("/productosIniciales", (req,res) => {
    
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
       PRODUCTOS.create(e)
    });
    res.status(200).json({exito: "Productos creados con exito",newProduct})
})

module.exports = router