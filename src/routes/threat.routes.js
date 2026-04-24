const express = require('express');
const router = express.Router();
const Threat = require('../models/Threat.model');

router.get('/', async (req, res) => {
  const threats = await Threat.find().sort({ createdAt: -1 });
  res.json(threats);
});

router.patch('/:id/resolve', async (req, res) => {
  const threat = await Threat.findById(req.params.id);

  threat.resolved = true;
  threat.resolvedAt = new Date();

  await threat.save();

  res.json({ message: 'Threat resolved' });
});

module.exports = router;