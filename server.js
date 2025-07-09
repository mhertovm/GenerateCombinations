require('dotenv').config();
const express = require("express");
const port = process.env.PORT || 3001
const cors = require("cors");
const router = require('./router/combinations.router');
const { errorHandler } = require('./middlewares/errorHandler');
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;
const { itemsTable, combinationsTable, responsesTable } = require('./models/combinations.models')
const db = require('./db');

// db models
itemsTable(db);
combinationsTable(db);
responsesTable(db);

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });

} else {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use('/', router);

    // for next(error)
    app.use(errorHandler);

    app.listen(port, () => {
        console.log(`App listening on port ${port} | PID: ${process.pid}`);
    });
};