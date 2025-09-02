const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const farmerController = require('../controllers/farmerController');

const router = express.Router();

// All routes are protected and admin-only
router.use(auth, role('admin'));

router.get('/', farmerController.getAllFarmers);

router.get('/:id', farmerController.getFarmer);

router.post(
  '/',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail()
  ],
  farmerController.createFarmer
);

router.put(
  '/:id',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail()
  ],
  farmerController.updateFarmer
);

router.delete('/:id', farmerController.deleteFarmer);

module.exports = router;