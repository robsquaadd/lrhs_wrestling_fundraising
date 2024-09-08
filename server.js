const express = require('express');
const routes = require("./controllers")
const Sequelize = require('sequelize')
const path = require("path")
require("dotenv").config();

/*let sequelize;
if (process.env.JAWSDB_URL) {
	sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
	sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
		host: 'localhost',
		dialect: 'mysql',
		port: 3386
	});
}*/

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(routes);

app.use("/", () => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});
