const { validationResult } = require('express-validator');
const { Crop, User, sequelize } = require('../models');
const { Op } = require('sequelize');

const cropController = {
  getAllCrops: async (req, res) => {
    try {
      const crops = await Crop.findAll({
        include: [{
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'email']
        }],
        order: [['created_at', 'DESC']]
      });
      
      res.json(crops);
    } catch (error) {
      console.error('Get all crops error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getFarmerCrops: async (req, res) => {
    try {
      const crops = await Crop.findAll({
        where: { farmer_id: req.user.id },
        order: [['created_at', 'DESC']]
      });
      
      res.json(crops);
    } catch (error) {
      console.error('Get farmer crops error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getCrop: async (req, res) => {
    try {
      const crop = await Crop.findByPk(req.params.id, {
        include: [{
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'email']
        }]
      });
      
      if (!crop) {
        return res.status(404).json({ message: 'Crop not found' });
      }
      
      // Farmers can only access their own crops
      if (req.user.role === 'farmer' && crop.farmer_id !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(crop);
    } catch (error) {
      console.error('Get crop error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createCrop: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const cropData = {
        ...req.body,
        farmer_id: req.user.role === 'admin' ? req.body.farmer_id : req.user.id
      };

      const newCrop = await Crop.create(cropData);
      
      // Fetch the complete crop with farmer details
      const completeCrop = await Crop.findByPk(newCrop.id, {
        include: [{
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'email']
        }]
      });
      
      res.status(201).json(completeCrop);
    } catch (error) {
      console.error('Create crop error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateCrop: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const crop = await Crop.findByPk(req.params.id);
      if (!crop) {
        return res.status(404).json({ message: 'Crop not found' });
      }

      // Farmers can only update their own crops
      if (req.user.role === 'farmer' && crop.farmer_id !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await crop.update(req.body);
      
      // Fetch the updated crop with farmer details
      const updatedCrop = await Crop.findByPk(crop.id, {
        include: [{
          model: User,
          as: 'farmer',
          attributes: ['id', 'name', 'email']
        }]
      });
      
      res.json(updatedCrop);
    } catch (error) {
      console.error('Update crop error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteCrop: async (req, res) => {
    try {
      const crop = await Crop.findByPk(req.params.id);
      if (!crop) {
        return res.status(404).json({ message: 'Crop not found' });
      }

      // Farmers can only delete their own crops
      if (req.user.role === 'farmer' && crop.farmer_id !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await crop.destroy();
      res.json({ message: 'Crop deleted successfully' });
    } catch (error) {
      console.error('Delete crop error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getCropsStats: async (req, res) => {
    try {
      const stats = await User.findAll({
        where: { role: 'farmer' },
        attributes: [
          'id',
          'name',
          [sequelize.fn('COUNT', sequelize.col('crops.id')), 'crop_count']
        ],
        include: [{
          model: Crop,
          as: 'crops',
          attributes: [],
          required: false
        }],
        group: ['User.id'],
        raw: true
      });
      
      res.json(stats);
    } catch (error) {
      console.error('Get crops stats error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getCropsByType: async (req, res) => {
    try {
      let whereClause = {};
      
      if (req.user.role === 'farmer') {
        whereClause.farmer_id = req.user.id;
      }
      
      const stats = await Crop.findAll({
        where: whereClause,
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['type'],
        raw: true
      });
      
      res.json(stats);
    } catch (error) {
      console.error('Get crops by type error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = cropController;