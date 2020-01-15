const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const app = express();

mongoose.connect('mongodb+srv://oministack:oministack10@cluster0-nbbby.mongodb.net/week10?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true,
});
app.use(cors());
app.use(express.json());
app.use(routes);

// Tipos de parâmetros:
// Query params: request.query(Filtros, Ordenação, Paginação...)
// Route params: request.params(Identificar um recurso na alteração ou remoçao)
// Body: request.body(Dados para criação ou alteração de um registro)
// Mongo DB

app.listen(3333);
