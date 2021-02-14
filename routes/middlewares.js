require("dotenv").config();

const jwt = require("jsonwebtoken");
const db = require("../routes/conexion")
require('dotenv').config()


// require('dotenv').config()
// const dotenv = require('db')
// dotenv.connect({
//     jwtClave: process.env.jwtClave
// })

var jwtClave = process.env.JWT_CLAVE;

var codigoToken; 

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
const datosRecibidos = (req, res, next) => {
    const {user,nombre,apellido,email,telefono,direccion,password} = req.body
    if (!user || !nombre || !apellido || !email || !telefono || !direccion || !password) {
        res.status(400).json({
            errorCampos: 'faltan campos'
        })
    }
    if (validarEmail(email) === false) {
        res.status(400).json({
            error: 'Email incorrecto'
        })
    }
    if (validarClave(password) === false) {
        res.status(400).json({
            error: 'Password incorrecto'
        })
    }
    next()
}
/// 
const datosLogin = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({
            error: 'faltan campos'
        })
    }
    let access = await validateUser(email, password)
    if (access) {
        console.log(access);
        req.token = access.codigoToken
        req.user = access.user
        next()
    }
    else {
        res.status(401).json({
            error: "email o password invalidas"

        })
    }
}

//validacion JWT
const validacionJwt = (req, res, next) => {
    //const token = req.headers.authorization.split(' ')[1];
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

function tokenGenerado (nombre, isAdmin) {

    const payload = {
        nombreUser: nombre,
        Admin: isAdmin
    } 
    
    var token = jwt.sign(payload, jwtClave);
    return token
}

// 8 caracteres con (MAYUS, MINUS, NUM y Caracter)
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



function validarEmail(valor) {
    if (/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(valor)) {
        return true
    } else {
        return false
    }
}


const validateUser = async (email, password) => {
    const users = await db.query(`SELECT * FROM users`);
    const userSelected = users.find(e => e.EMAIL.toUpperCase() === email.toUpperCase().trim())
    if (userSelected) {
        if (userSelected.PASSWORD.toUpperCase() == password.toUpperCase().trim()) {
            codigoToken = await tokenGenerado(userSelected.NOMBRE, userSelected.isAdmin)
            const user = {nombre : userSelected.NOMBRE, isAdmin: userSelected.isAdmin}   
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


module.exports = {datosRecibidos,datosLogin,validacionJwt,verificarProducto};