const { validationResult } = require('express-validator');
const { User, Crop } = require('../models');

const farmerController = {
  createFarmer: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if farmer already exists
      const existingFarmer = await User.findOne({ where: { email } });
      if (existingFarmer) {
        return res.status(400).json({ message: 'Farmer with this email already exists' });
      }

      // Create farmer
      const newFarmer = await User.create({
        name,
        email,
        password,  // optionally hash password if needed
        role: 'farmer'
      });

      // Remove password before sending response
      const farmerResponse = newFarmer.toJSON();
      delete farmerResponse.password;

      res.status(201).json(farmerResponse);
    } catch (error) {
      console.error('Create farmer error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  ,

  getAllFarmers: async (req, res) => {
    try {
      const farmers = await User.findAllFarmers();
      res.json(farmers);
    } catch (error) {
      console.error('Get all farmers error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getFarmer: async (req, res) => {
    try {
      const farmer = await User.findOne({
        where: {
          id: req.params.id,
          role: 'farmer'
        },
        attributes: { exclude: ['password'] },
        include: [{
          model: Crop,
          as: 'crops',
          attributes: ['id', 'name', 'type', 'quantity', 'created_at']
        }]
      });

      if (!farmer) {
        return res.status(404).json({ message: 'Farmer not found' });
      }

      res.json(farmer);
    } catch (error) {
      console.error('Get farmer error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateFarmer: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const farmer = await User.findOne({
        where: {
          id: req.params.id,
          role: 'farmer'
        }
      });

      if (!farmer) {
        return res.status(404).json({ message: 'Farmer not found' });
      }

      const { name, email } = req.body;
      await farmer.update({ name, email });

      // Remove password from response
      const farmerResponse = farmer.toJSON();
      delete farmerResponse.password;

      res.json(farmerResponse);
    } catch (error) {
      console.error('Update farmer error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteFarmer: async (req, res) => {
    try {
      const farmer = await User.findOne({
        where: {
          id: req.params.id,
          role: 'farmer'
        }
      });

      if (!farmer) {
        return res.status(404).json({ message: 'Farmer not found' });
      }

      await farmer.destroy();
      res.json({ message: 'Farmer deleted successfully' });
    } catch (error) {
      console.error('Delete farmer error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = farmerController;