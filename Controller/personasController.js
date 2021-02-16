const express = require("express");
const router = express.Router();
const models = require("../routes/models")
const USERS = models.Users
var {datosRecibidos,tokenGenerado,validacionJwt} = require("../routes/middlewares")

router.post("/", datosRecibidos,  async (req,res) => {
    const {user,nombre,apellido,email,telefono,direccion,password,isAdmin} = req.body
    const newUser = {
        user,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        password,
        isAdmin
    }
    token = await tokenGenerado(nombre,isAdmin)
    if(newUser){
        const usuario = await USERS.create(newUser)
        return res.status(200).json({Token:token,usuario}) 
    }
    else return res.status(200).json({error: "Ha ocurrido un error..."})
})

router.get("/", validacionJwt, async (req,res) => {
    if(req.user.admin==="false"){
        res.send('No está autorizado');
        return
    }
    console.log(req.user);
    const consulta = await USERS.findAll()
    if(consulta) return res.status(200).json(consulta) 
    return res.status(200).json({error : "No se pudo realizar la consulta..."}) 
})

router.get("/:id", async (req,res) => {
    const findUser = await USERS.findOne({
        where : {id: req.params.id}
    });
    console.log(findUser);
    if(findUser) return res.status(200).json(findUser)
    return res.status(400).json({error : "No se encontro ID..."})
})

router.put("/:id",async (req,res) =>{
    const actualizarUser = await USERS.update(req.body,{
        where : {id: req.params.id}
    });
    console.log(actualizarUser);
    if(actualizarUser[0]) return res.status(200).json({exito: "Acutalizado con exito..."})
    return res.status(400).json({error : "No se encontro ID..."})
})

router.delete("/:id",validacionJwt , async (req,res) =>{
    if(req.user.admin==="false"){
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