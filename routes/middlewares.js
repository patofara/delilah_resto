require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../routes/conexion")
const models = require("../routes/models")
var jwtClave = process.env.JWT_CLAVE;
var codigoToken; 


// VERIFICA LOS CAMPOS DE LA CREACION DE PEDIDOS

const verificarPedido = (req, res, next) => {
    const {idProducto,cantidad} = req.body
    if(!idProducto){
        return res.status(400).json({error : "Por favor ingrese un nombreProducto"})
    }
    if(!cantidad){
        return res.status(400).json({error : "Por favor ingrese una cantidad"})
    }
    else{
        next()
    }
}


// verifica que todos los campos existan a la hora de crear un producto
const verificarProducto = (req, res, next) => {
    const {nombre,descripcion,foto,stock,precio} = req.body
    if (!nombre || !descripcion || !foto || !stock || !precio) {
        res.status(400).json({
            errorCampos: 'faltan campos'
        })
    }
    else{
        next()
    }
}

// evalua que los datos que recibe al crear un usuario sean correctos
const datosRecibidos = (req, res, next) => {
    const {usuario,nombre,apellido,email,telefono,direccion,password,isAdmin} = req.body
    if (!usuario || !nombre || !apellido || !email || !telefono || !direccion || !password || !isAdmin) {
        return res.status(400).json("Faltan campos")
    }
    if (validarEmail(email) === false) {
        return res.status(400).json({
            error: 'Email incorrecto. Debe contener "@" y ".com"'
        })
    }
    if (validarClave(password) === false) {
        return res.status(400).json({
            error: 'Password incorrecto. Debe contener al menos 1MAYUS, 1CARACTER, 1NUM y 8 caracteres'
        })
    }
    if(telefono.length < 6 || isNaN(telefono)){
        return res.status(400).json({
            error: 'El telefono deben ser solo numeros y minimo 6 caracteres'
        })
    }
    else {
        next()
    }
}

const datosLogin = async (req, res, next) => {
    const {usuario, password } = req.body
    if (!usuario || !password) {
        res.status(400).json({
            error: 'faltan campos'
        })
    }
    let access = await validateUser(usuario, password)
    if (access) {
        req.token = access.codigoToken
        req.user = access.userName
        next()
    }
    else {
        res.status(401).json({
            error: "user o password invalidas"

        })
    }
}

// verifica que el usuario se encuentra dentro de la base de datos y lo devuelve en token
const validateUser = async (userName, password) => {
    const userSelected = await models.Usuarios.findOne({
        where : {usuario: userName}
    });
    if (userSelected) {
        if (userSelected.password === password.trim()) {
            codigoToken = await tokenGenerado(userSelected.usuario, userSelected.isAdmin)
            const user = {userName : userSelected.usuario, isAdmin: userSelected.isAdmin}   
            return {codigoToken, user};
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

// Recuperacion TOKEN
const validacionJwt = (req, res, next) => {
    const codigoToken = req.headers.authorization.split(' ')[1];
    jwt.verify(codigoToken, jwtClave, (err, decoded) => {
        if (err) {
            res.send('No está autorizado');
        }
        else{
            req.user = decoded;
            next()
        }
    });
}

function tokenGenerado (user, isAdmin) {
    const payload = {
        nombreUser: user,
        isAdmin: isAdmin
    } 
    var token = jwt.sign(payload, jwtClave);
    return token
}

// password 8 caracteres con (MAYUS, MINUS, NUM y Caracter)
function validarClave(password) {
    if (password.length >= 8) {
        var mayuscula = false;
        var minuscula = false;
        var numero = false;
        var caracter_raro = false;

        for (var i = 0; i < password.length; i++) {
            if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
                mayuscula = true;
            }
            else if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) {
                minuscula = true;
            }
            else if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
                numero = true;
            }
            else {
                caracter_raro = true;
            }
        }
        if (mayuscula == true && minuscula == true && caracter_raro == true && numero == true) {
            return true;
        }
    }
    return false;
}


// funcion para validar los caracteres de un email
function validarEmail(valor) {
    if (/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(valor)) {
        return true
    } else {
        return false
    }
}


module.exports = {datosRecibidos,verificarProducto,verificarPedido,tokenGenerado,validacionJwt,datosLogin};