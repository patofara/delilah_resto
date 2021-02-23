const conexion = require("./conexion")
const sequelize = conexion.sequelize
const {Model, DataTypes, Association} = require('sequelize');


sequelize.define()
class Productos extends Model {}
Productos.init({
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {type:DataTypes.STRING,allowNull: false},
        descripcion: {type:DataTypes.STRING,allowNull: false},
        foto: {type:DataTypes.STRING,allowNull: false},
        stock: {type:DataTypes.INTEGER,allowNull: false},
        favorito: {type:DataTypes.BOOLEAN},
        precio: {type:DataTypes.FLOAT,allowNull: false},
    }, {
    sequelize,
    modelName: "Productos"
});


class Usuarios extends Model {}
Usuarios.init({
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        usuario: {type:DataTypes.STRING,allowNull: false},
        nombre : {type:DataTypes.STRING,allowNull: false}, 
        apellido: {type:DataTypes.STRING,allowNull: false}, 
        email: {type:DataTypes.STRING,allowNull: false}, 
        telefono: {type:DataTypes.INTEGER,allowNull: false}, 
        direccion: {type:DataTypes.STRING,allowNull: false}, 
        password: {type:DataTypes.STRING,allowNull: false},
        isAdmin: {type:DataTypes.BOOLEAN,allowNull:false} 

    }, {
    sequelize,
    modelName: "Usuarios"
});


class Pedidos extends Model {}
Pedidos.init({
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        forma_pago: {type:DataTypes.STRING,allowNull: false},
        total_pedido: {type:DataTypes.INTEGER,allowNull: false}
    }, {
    sequelize,
    modelName: "Pedidos"
});
class Estados extends Model {}
Estados.init({
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        estado: {type:DataTypes.STRING,allowNull: false}
    }, {
    sequelize,
    modelName: "Estados"
});


class Detalle_Pedidos extends Model {}
Detalle_Pedidos.init({
        id : {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
        // nroPedido: {type: DataTypes.INTEGER,allowNull: false},
        nombreProducto: {type:DataTypes.STRING,allowNull: false},
        cantidadProducto: {type:DataTypes.INTEGER,allowNull: false},
        precio:{type:DataTypes.INTEGER,allowNull: false}
    }, {
    sequelize,
    modelName: "Detalle_pedido"
});




module.exports = {Productos,Usuarios,Detalle_Pedidos,Pedidos,Estados}
