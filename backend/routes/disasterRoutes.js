const express = require('express');
const router = express.Router();
const { createDisaster, getDisasters, extractLocation, verifyImage, mockSocialMedia } = require('../controllers/disasterController');

router.post('/', createDisaster);
router.get('/', getDisasters);
router.post('/extract-location', extractLocation);
router.post('/verify-image', verifyImage);
router.get('/:id/social-media', mockSocialMedia);

module.exports = router;