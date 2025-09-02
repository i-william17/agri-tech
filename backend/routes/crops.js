const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const cropController = require('../controllers/cropController');

const router = express.Router();

// All routes are protected
router.use(auth);

router.get('/', (req, res, next) => {
  if (req.user.role === 'admin') {
    return cropController.getAllCrops(req, res, next);
  } else {
    return cropController.getFarmerCrops(req, res, next);
  }
});

router.get('/stats', role('admin'), cropController.getCropsStats);

router.get('/types', cropController.getCropsByType);

router.get('/:id', cropController.getCrop);

router.post(
  '/',
  [
    body('name', 'Crop name is required').not().isEmpty(),
    body('type', 'Crop type is required').not().isEmpty(),
    body('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
  ],
  cropController.createCrop
);

router.put(
  '/:id',
  [
    body('name', 'Crop name is required').not().isEmpty(),
    body('type', 'Crop type is required').not().isEmpty(),
    body('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
  ],
  cropController.updateCrop
);

router.delete('/:id', cropController.deleteCrop);

module.exports = router;