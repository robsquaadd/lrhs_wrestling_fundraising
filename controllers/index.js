const router = require("express").Router();
const mailingListRoutes = require('./mailingListRoutes.js');
router.use('/mailingList', mailingListRoutes);
router.use((req, res) => {
	res.status(404).send("Pikachu is the best Pokemon ever!").end();
});
module.exports = router;
