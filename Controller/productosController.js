const express = require("express");
var {verificarProducto,validacionJwt} = require("../routes/middlewares")
const router = express.Router();
const models = require("../routes/models")
const PRODUCTOS = models.Productos


// AGREGAR PRODUCTOS DE A 1, *SOLO ADMINS*
// BODY => stock = "INTEGER" - favorito: BOOLEAN
router.post("/", validacionJwt ,verificarProducto, async (req,res) => {
    if(req.user.isAdmin==false){
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
    if(findProduct) return res.status(200).json(findProduct)
    return res.status(400).json({error : "No se encontro ID..."})
})

// ACTUALIZAR UN PRODUCTO POR ID, *SOLO ADMINS*
router.put("/:id", validacionJwt, async (req,res) =>{
    if(req.user.isAdmin==false){
        res.send('No está autorizado');
        return
    }
    const actualizarProducto = await PRODUCTOS.update(req.body,{
        where : {id: req.params.id}
    });
    const verProducto = await PRODUCTOS.findOne({
        where: {id : req.params.id}
    })
    if(actualizarProducto[0]) return res.status(200).json({exito: "Acutalizado con exito...", verProducto})
    return res.status(400).json({error : "No se encontro ID..."})
})

// BORRAR PRODUCTO POR ID , *SOLO ADMINS*
router.delete("/:id", validacionJwt, async (req,res) =>{
    if(req.user.isAdmin==false){
        res.send('No está autorizado');
        return
    }
    const verProducto = await PRODUCTOS.findOne({
        where: {id : req.params.id}
    })
    const deleteProduct = await PRODUCTOS.destroy({
        where : {id: req.params.id}
    });
    if(deleteProduct) return res.status(200).json({exito: "Borrado con exito...", "Producto Borrado": verProducto})
    return res.status(400).json({error : "No se encontro ID..."})
})




module.exports = router