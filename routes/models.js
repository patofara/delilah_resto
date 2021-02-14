const conexion = require("./conexion")
const sequelize = conexion.sequelize
const {Model, DataTypes} = require('sequelize');


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


class Users extends Model {}
Users.init({
         id : {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true
          },
          user: {type:DataTypes.STRING,allowNull: false},
          nombre : {type:DataTypes.STRING,allowNull: false}, 
          apellido: {type:DataTypes.STRING,allowNull: false}, 
          email: {type:DataTypes.STRING,allowNull: false}, 
          telefono: {type:DataTypes.STRING,allowNull: false}, 
          direccion: {type:DataTypes.STRING,allowNull: false}, 
          password: {type:DataTypes.STRING,allowNull: false}, 

}, {
    sequelize,
    modelName: "Users"
});


class Pedidos extends Model {}
Pedidos.init({
         id_pedidos : {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true
        },
        forma_pago: {type:DataTypes.STRING,allowNull: false},
        fk_ID_detalle: {type:DataTypes.STRING,allowNull: false},
        fk_ID_persona:{type:DataTypes.STRING,allowNull: false},
        total_pedido: {type:DataTypes.INTEGER,allowNull: false}
}, {
    sequelize,
    modelName: "Pedidos"
});


class Detalle_Pedidos extends Model {}
Detalle_Pedidos.init({
         id_detalle : {
               type: DataTypes.INTEGER,
               allowNull: false
        },
        
        fk_productos_nombre: {type:DataTypes.STRING,allowNull: false},
        fk_productos_precio: {type:DataTypes.STRING,allowNull: false},
     
}, {
    sequelize,
    modelName: "Detalle_pedido"
});



module.exports = {Productos,Users,Detalle_Pedidos,Pedidos}
