const express = require('express');
const routes = require("./controllers")
const path = require("path")
const sequelize = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname));
app.use(routes);

sequelize.sync({force: false}).then(() => {
	app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});
});
