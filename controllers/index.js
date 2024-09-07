const router = require("express").Router();
const mailingListRoutes = require('./mailingListRoutes.js');
const adminRoutes = require('./adminRoutes.js');
router.use('/mailingList', mailingListRoutes);
router.use('/admin', adminRoutes);
router.use((req, res) => {
	res.status(404).send("Pikachu is the best Pokemon ever!").end();
});
module.exports = router;
