const express = require("express");
const router = express.Router();
const models = require("../routes/models")
const USERS = models.Usuarios
var {datosRecibidos,validacionJwt,datosLogin} = require("../routes/middlewares")


// CREAR USUARIO
router.post("/", datosRecibidos,  async (req,res) => {
    const {usuario,nombre,apellido,email,telefono,direccion,password,isAdmin} = req.body
    const newUser = {
        usuario,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        password,
        isAdmin
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

// LOGUEAR PARA RECIRIR TOKEN
router.post("/login", datosLogin, (req,res) => {
    res.status(200).status(200).json({exito:{
        token : req.token,
        user:req.user
    }})
})


// TRAE TODOS LOS USUARIOS , SOLO ADMINS
router.get("/", validacionJwt, async (req,res) => {
    if(req.user.isAdmin==false){
        res.send('No está autorizado');
        return
    }
    const consulta = await USERS.findAll()
    if(consulta) return res.status(200).json(consulta) 
    return res.status(200).json({error : "No se pudo realizar la consulta..."}) 
})

// TRAE TU USUARIO , *SOLO CLIENTES*
router.get("/miUsuario", validacionJwt, async (req,res) => {
    if(req.user.isAdmin==true){
        res.send('Debes incluir un ID');
        return
    }
    const findUser = await USERS.findOne({
        where : {usuario: req.user.nombreUser}
    });
    if(findUser) return res.status(200).json(findUser) 
    return res.status(200).json({error : "No se pudo realizar la consulta..."}) 
})


// TRAE USUARIO POR ID , *SOLO ADMIN*
router.get("/:id", validacionJwt, async (req,res) => { 
    if(req.user.isAdmin==false){
        res.send('No está autorizado');
        return
    }
    const findUser = await USERS.findOne({
        where : {id: req.params.id}
    });
    if(findUser) return res.status(200).json(findUser)
    return res.status(400).json({error : "No se encontro ID..."})
})

// MODIFICA POR ID , SOLO PARA ADMINS
// router.put("/:id",validacionJwt ,async (req,res) =>{ // para que soolo se pueda modificar con el token
//     if(req.user.isAdmin==false){
//         res.send('No está autorizado');
//         return
//     }
//     const actualizarUser = await USERS.update(req.body,{
//         where : {id: req.params.id}
//     });
//     if(actualizarUser[0]) return res.status(200).json({exito: "Acutalizado con exito..."})
//     return res.status(400).json({error : "No se encontro ID..."})
// })

// MODIFICAR USUARIO , *SOLO CLIENTES*
router.put("/miUsuario",validacionJwt, async (req,res) =>{ // para que soolo se pueda modificar con el token
    console.log(req.user);
    if(req.user.isAdmin==true){
        res.send('No estas autorizado');
        return
    }
    const actualizarUser = await USERS.update(req.body,{
        where : {usuario: req.user.nombreUser}
    });
    if(actualizarUser[0]) return res.status(200).json({exito: "Acutalizado con exito..."})
    return res.status(400).json({error : "No se encontro ID..."})
})

router.delete("/:id",validacionJwt , async (req,res) =>{
    if(req.user.isAdmin==false){
        res.send('No está autorizado');
        return
    }
    const deleteUser = await USERS.destroy({
        where : {id: req.params.id}
    });
    if(deleteUser != 0) return res.status(200).json({exito: "Borrado con exito..."})
    return res.status(400).json({error : "No se encontro ID..."})
})


module.exports = router