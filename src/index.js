const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors());
app.use(express.json());
app.use(routes);

// Tipos de parâmetros:
// Query params: request.query(Filtros, Ordenação, Paginação...)
// Route params: request.params(Identificar um recurso na alteração ou remoçao)
// Body: request.body(Dados para criação ou alteração de um registro)
// Mongo DB

server.listen(process.env.PORT || 3333);
