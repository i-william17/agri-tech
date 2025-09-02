const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 20,       
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Test connection function
sequelize.testConnection = async function () {
  try {
    await this.authenticate();
    console.log('Neon PostgreSQL connection established successfully.');

    // Fetch some DB info
    const [results] = await this.query(
      `SELECT current_database() AS db_name, 
              current_user AS user, 
              version() AS version;`
    );

    console.log('Connected to DB:', results[0].db_name);
    console.log('User:', results[0].user);
    console.log('PostgreSQL Version:', results[0].version.split(',')[0]);

    return true;
  } catch (error) {
    console.error('Unable to connect to Neon:', error.message);
    return false;
  }
};

module.exports = sequelize;