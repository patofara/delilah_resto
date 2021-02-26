const express = require("express");
const router = express.Router();
const models = require("../routes/models")
const USERS = models.Usuarios
var {datosRecibidos,validacionJwt,datosLogin} = require("../routes/middlewares")


// CREAR USUARIO LISTO 
router.post("/", datosRecibidos,  async (req,res) => {
    const {usuario,nombre,apellido,email,telefono,direccion,password} = req.body
    const newUser = {
        usuario,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        password,
        isAdmin: false
    }
    const validarNombre = await models.Usuarios.findOne({
        where : {usuario:usuario}
    })
    if (validarNombre) {
        return res.status(400).json("Ya existe nombre de usuario")
    }
    if(newUser){
        const usuario = await USERS.create(newUser)
        return res.status(200).json({Usuario:usuario}) 
    }
    else return res.status(200).json({error: "Ha ocurrido un error..."})
})

// LOGUEAR PARA RECIRIR TOKEN LISTO
router.post("/login", datosLogin, (req,res) => {
    res.status(200).status(200).json({exito:{
        token : req.token,
        user:req.user
    }})
})


// TRAE TODOS LOS USUARIOS * admin* , TRAE EL USUARIO DEL CLIENTE *cliente* LISTO 
router.get("/", validacionJwt, async (req,res) => {
    if(req.user.isAdmin==false){
        const findUser = await USERS.findOne({
            where : {usuario: req.user.nombreUser}
        });
        if(findUser) return res.status(200).json(findUser) 
        return res.status(400).json({error : "No se pudo realizar la consulta..."})
    }
    const consulta = await USERS.findAll()
    if(consulta) return res.status(200).json(consulta) 
    return res.status(400).json({error : "No se pudo realizar la consulta..."}) 
})


// TRAE USUARIO POR ID , *SOLO ADMIN* LISTO 
router.get("/:usuario", validacionJwt, async (req,res) => { 
    if(req.user.isAdmin==false) return res.status(401).json({error : "No esta autorizado..."})
    const findUser = await USERS.findOne({
        where : {usuario: req.params.usuario}
    });
    if(findUser) return res.status(200).json(findUser)
    return res.status(400).json({error : "No se encontro Usuario..."})
})

// MODIFICAR USUARIO , *SOLO CLIENTES* LISTO * falta schema
router.put("/miUsuario",validacionJwt, async (req,res) =>{ // para que soolo se pueda modificar con el token
    if(req.user.isAdmin==true) return res.status(401).json({error : "No esta autorizado.."})
    const actualizarUser = await USERS.update(req.body,{
        where : {usuario: req.user.nombreUser}
    });
    if(actualizarUser[0]) return res.status(200).json({exito: "Acutalizado con exito..."})
    return res.status(400).json({error : "No se encontro usuario..."})
})

router.delete("/:usuario",validacionJwt , async (req,res) =>{
    if(req.user.isAdmin==false) return res.status(401).json({error : "No esta autorizado..."})
    const deleteUser = await USERS.destroy({
        where : {id: req.params.usuario}
    });
    if(deleteUser != 0) return res.status(200).json({exito: "Borrado con exito..."})
    return res.status(400).json({error : "No se encontro usuario..."})
})


module.exports = router