const express = require("express");
const router = express.Router();
const models = require("../routes/models")
var {verificarPedido,validacionJwt} = require("../routes/middlewares")


                            // PASO 1 => CREAR PEDIDO

// CREA EL PEDIDO 
router.post("/", verificarPedido, validacionJwt, async (req,res) => {
    const {idProducto,cantidad,forma_pago} = req.body
    if(!forma_pago){
        return res.status(400).json({error : "Por favor ingrese una forma_pago"})
    }
    for (let i = 0; i < idProducto.length; i++) {
        const element = idProducto[i];
        const articuloStock = await models.Productos.findOne({
            where : {id: element}
        }); 
        if (articuloStock.dataValues.stock <=0) return res.status(200).json({msj: `Sin stock de ${articuloStock.dataValues.nombre}`})
    }
       
    var total_pedido = 0
    for (let i = 0; i < idProducto.length; i++) {
        const articulo = await models.Productos.findOne({
            where : {id: idProducto[i]}
        }); 
        total_pedido+=(articulo.dataValues.precio * cantidad[i])
        await models.Productos.update({stock:(articulo.dataValues.stock - cantidad[i])}, {
            where : {id: idProducto[i]}
        });
        const newDetalle = {
            nombreProducto: articulo.dataValues.nombre,
            cantidadProducto: cantidad[i],
            precio: articulo.dataValues.precio * cantidad[i],
        }
        await models.Detalle_Pedidos.create(newDetalle)
    }
    const user = await models.Usuarios.findOne({
        where : {usuario : req.user.nombreUser}
    })
    const newPedido = {
        forma_pago,
        total_pedido,
        UsuarioId: user.dataValues.id, 
        EstadoId: 1
    }
    
    if(newPedido){
        const pedido = await models.Pedidos.create(newPedido)
        await models.Detalle_Pedidos.update({PedidoId:pedido.id},{
            where : {PedidoId: null}
        });
        return res.status(200).json({
        Mensaje:`El pedido de se ha creado con exito.`,
        "Numero de pedido": pedido.id,
        "A pagar": `$${newPedido.total_pedido}`,
        "Forma de pago": forma_pago} )
    }
    else return res.status(400).json({error: "Ha ocurrido un error..."}) 
})



// MODIFICA ESTADO DEL PEDIDO
router.put("/:id", validacionJwt, async(req,res) => {
    if(req.user.isAdmin==false){
        res.send('No está autorizado');
        return
    }
    const consulta = await models.Pedidos.findOne({
        where : {id : req.params.id}
    })
    if (consulta.EstadoId==5) {
        return res.send("Su pedido ya ha sido finalizado")
    }
    const pedido = await models.Pedidos.update({EstadoId: (consulta.EstadoId + 1)},{
        where : {id: req.params.id}
    })
    
    const preConsulta = await models.Estados.findOne({
        where : {id:consulta.EstadoId}
    })
    const postConsulta = await models.Estados.findOne({
        where : {id:(consulta.EstadoId+1)}
    })
    if(pedido[0]) return res.status(200).json({exito: `El pedido numero ${req.params.id} paso de ${preConsulta.dataValues.estado} a ${postConsulta.dataValues.estado}`})
    return res.status(400).json({error : "No se encontro ID..."})
})

// OBTIENE TODOS LOS PEDIDOS *SOLO ADMINS*
router.get("/", validacionJwt, async (req,res) => {
    if(req.user.isAdmin==false){
        res.send('No está autorizado');
        return
    }
    const pedidos = await models.Pedidos.findAll()
    let arrayPedidos = []
    for (let i = 0; i < pedidos.length; i++) {
        let arrayDetalle = []
        let detalle = await models.Detalle_Pedidos.findAll({
           where : {PedidoId: (i+1)}
        });
        detalle.forEach(element => {
            arrayDetalle.push(element.cantidadProducto)
            arrayDetalle.push(element.nombreProducto)
        });
        var pushPedidos = {
            "Nro Pedido": pedidos[i].id,
            "Valor pedido": `$${pedidos[i].total_pedido}`,
            "Detalle": arrayDetalle.join(" ")
        }
        arrayPedidos.push(pushPedidos)
    }
    return res.status(200).json(arrayPedidos)
})

// CONSULTA PEDIDO CLIENTE
router.get("/myPedido", validacionJwt, async (req,res) => {
    if(req.user.isAdmin==true){
        res.send('No está autorizado');
        return
    }
    let detalleProductos = []
    const user = await models.Usuarios.findOne({
        where : {usuario: req.user.nombreUser}
    });
    const pedido = await models.Pedidos.findOne({
        where : {UserId: user.id}
    });
    if(!pedido){
        return res.status(400).json({error : "No hizo ningun pedido"})
    }
    const detalles = await models.Detalle_Pedidos.findAll({
        where : {PedidoId: pedido.id}
    });
    detalles.forEach(element => {
        detalleProductos.push(element.cantidadProducto)
        detalleProductos.push(element.nombreProducto)
    });
    return res.status(200).json({
        Detalle: detalleProductos.join(" "),
        "A pagar": `$${pedido.total_pedido}`,
        "Medio de pago": pedido.forma_pago
    })
})

//BORRAR PEDIDO CON ID, *SOLO ADMIN*
router.delete("/:id", validacionJwt,async (req,res) => {
    if(req.user.isAdmin==false){
        res.send('No está autorizado');
        return
    }
    const pedido = await models.Pedidos.destroy({
        where : {id: req.params.id}
    });
    if(pedido != 0) return res.status(200).json({msj : `Pedido numero ${req.params.id} borrado con exito`})
    return res.status(400).json({error : "No se encontro ID..."})
})

module.exports = router