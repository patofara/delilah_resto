const express = require("express");
const router = express.Router();
const models = require("../routes/models")
var {verificarPedido,validacionJwt} = require("../routes/middlewares")


                            // PASO 1 => CREAR PEDIDO

// CREA EL PEDIDO 
// BODY => producto : "Nombre del producto" ; cantidad : "INTEGER" ; forma_pago: "String"
router.post("/", verificarPedido, validacionJwt, async (req,res) => {
    const {idProducto,cantidad,forma_pago} = req.body
    if(!forma_pago){
        return res.status(400).json({error : "Por favor ingrese una forma_pago"})
    }
    var total_pedido = 0
    for (let i = 0; i < idProducto.length; i++) {
        const element = idProducto[i];
        const articulo = await models.Productos.findOne({
            where : {id: element}
        }); 
        if (articulo.dataValues.stock <=0) return res.status(200).json({msj: `Sin stock de ${articulo.dataValues.nombre}`})
        total_pedido+=(articulo.dataValues.precio * cantidad[i])
        await models.Productos.update({stock:(articulo.dataValues.stock - cantidad[i])}, {
            where : {id: element}
        });
        const newDetalle = {
            nombreProducto: articulo.dataValues.nombre,
            cantidadProducto: cantidad[i],
            precio: articulo.dataValues.precio * cantidad[i],
        }
        await models.Detalle_Pedidos.create(newDetalle)
    }
    const user = await models.Users.findOne({
        where : {user : req.user.nombreUser}
    })
    const newPedido = {
        forma_pago,
        total_pedido,
        UserId: user.dataValues.id  
    }
    
    if(newPedido){
        const pedido = await models.Pedidos.create(newPedido)
        return res.status(200).json({
        Mensaje:`El pedido de se ha creado con exito.`,
        "Numero de pedido": pedido.dataValues.id,
        "A pagar": `$${newPedido.total_pedido}`,
        "Forma de pago": forma_pago} )
    }
    else return res.status(400).json({error: "Ha ocurrido un error..."}) 
})


                                // PASO 2 => agrega al pedido


// AGREGAR PRODUCTOS AL PEDIDO
// PARAMS id => id del pedido al que se quiere agregar 
// BODY => producto = "nombre del producto" - cantidad = "INTEGER"
router.put("/:id", verificarPedido, async(req,res) => {
    const {idProducto,cantidad} = req.body
    const findPedido = await models.Pedidos.findOne({
        where : {id: req.params.id}
    });
    const articulo = await models.Productos.findOne({
        where : {id: idProducto}
    });
    if (articulo.dataValues.stock <= 0) {
        res.status(200).json({msj: `Sin stock de ${articulo.dataValues.nombre}`})
        return
    }
    await models.Productos.update({stock:(articulo.dataValues.stock - cantidad)}, {
        where : {id: idProducto}
    });
    const newDetalle = {
        nombreProducto: articulo.dataValues.nombre,
        cantidadProducto: cantidad,
        precio: (articulo.dataValues.precio * cantidad),
        PedidoId: req.params.id
    }
    await models.Pedidos.update({ total_pedido: (findPedido.total_pedido + newDetalle.precio) }, {
        where : {id: req.params.id}
    });
    await models.Detalle_Pedidos.create(newDetalle)
    
    if (newDetalle) {
        res.status(200).json({msj:
        `Se ha agregado ${cantidad} ${articulo.dataValues.nombre} a su pedido por un valor de $${newDetalle.precio}`,
        "Nuevo monto del pedido" : `$${findPedido.total_pedido + newDetalle.precio}`
    })}
    else return res.status(400).json({error: "Ha ocurrido un error..."}) 

})

// CONSULTA PEDIDO CON ID 
router.get("/:id", async (req,res) => {
    let detalleProductos = []
    const detalles = await models.Detalle_Pedidos.findAll({
        where : {PedidoId: req.params.id}
    });
    detalles.forEach(element => {
        detalleProductos.push(element.cantidadProducto)
        detalleProductos.push(element.nombreProducto)
    });
    const pedido = await models.Pedidos.findOne({
        where : {id: req.params.id}
    });
    if(pedido) return res.status(200).json({
        Detalle: detalleProductos.join(" "),
        "A pagar": `$${pedido.total_pedido}`,
        "Medio de pago": pedido.forma_pago
    })
    return res.status(400).json({error : "No se encontro ID..."})
})

//BORRAR PEDIDO CON ID
router.delete("/:id", async (req,res) => {
    const pedido = await models.Pedidos.destroy({
        where : {id: req.params.id}
    });
    if(pedido != 0) return res.status(200).json({msj : `Pedido numero ${req.params.id} borrado con exito`})
    return res.status(400).json({error : "No se encontro ID..."})
})

module.exports = router