require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../routes/conexion")
var jwtClave = process.env.JWT_CLAVE;
var codigoToken; 


// VERIFICA LOS CAMPOS DE LA CREACION DE PEDIDOS

const verificarPedido = (req, res, next) => {
    const {producto,cantidad} = req.body
    if(!producto){
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
    const {user,nombre,apellido,email,telefono,direccion,password,isAdmin} = req.body
    if (!user || !nombre || !apellido || !email || !telefono || !direccion || !password || !isAdmin) {
        return res.status(400).json({
            errorCampos: 'faltan campos'
        })
    }
    if (validarEmail(email) === false) {
        return res.status(400).json({
            error: 'Email incorrecto'
        })
    }
    if (validarClave(password) === false) {
        return res.status(400).json({
            error: 'Password incorrecto'
        })
    }
    if(telefono.length < 6 || isNaN(telefono)){
        return res.status(400).json({
            error: 'Telefono incorrecto'
        })
    }
    else {
        next()
    }
}

// verifica que el usuario se encuentra dentro de la base de datos y lo devuelve en token
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

function tokenGenerado (nombre, isAdmin) {
    const payload = {
        nombreUser: nombre,
        admin: isAdmin
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


module.exports = {datosRecibidos,verificarProducto,verificarPedido,tokenGenerado,validacionJwt};