

const {Sequelize,DataTypes,Model } = require('sequelize');

const sequelize = require('../config/db')


  const db = {};
  db.Sequelize=sequelize;
  db.sequelize=sequelize;
  
  db.contact=require('./contact')(sequelize,DataTypes)
  db.user=require('./user')(sequelize,DataTypes,Model)
  db.userContacts = require('./userContacts')(sequelize,DataTypes,db.user,db.contact)
  db.userModel = require('./userModel')(sequelize,DataTypes)
  db.user.hasOne(db.contact,{foreignKey: 'user_id',as:'contactDetails'});
  //db.user.hasMany(db.contact,{foreignKey: 'user_id',as:'contactDetails'});
  db.contact.belongsTo(db.user,{foreignKey: 'user_id',as:'userDetails'});
  
//db.user.belongsToMany(db.contact, { through: db.userContacts });
//db.contact.belongsToMany(db.user, { through: db.userContacts });


db.sequelize.sync({force:false});
module.exports = db