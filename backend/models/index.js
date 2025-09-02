const sequelize = require('../config/database');
const User = require('./User');
const Crop = require('./Crop');

// Define associations
User.hasMany(Crop, {
  foreignKey: 'farmer_id',
  as: 'crops'
});

Crop.belongsTo(User, {
  foreignKey: 'farmer_id',
  as: 'farmer'
});

// Sync all models with database
const syncDatabase = async () => {
  try {
    // Force sync in development, alter in production
    const syncOption = process.env.NODE_ENV === 'development' 
      ? { force: false } 
      : { alter: true };
    
    await sequelize.sync(syncOption);
    console.log('Database synchronized successfully');
    
    return true;
  } catch (error) {
    console.error('Error synchronizing database:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  User,
  Crop,
  syncDatabase
};