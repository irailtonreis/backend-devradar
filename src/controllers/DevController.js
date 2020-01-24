const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/ParseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// index, show, update, destroy
module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      // eslint-disable-next-line no-undef
      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });
      // Filtrar ad conexões que estão no máximo 20km de distancias e que o
      // o novo dev tem pelo meno uma das tecnologias filtradas
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );
      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }
    return response.json(dev);
  },
  async destroy(request, response) {
    const { id } = request.params;

    const dev = await Dev.findById(id);

    if (!dev) {
      return response.status(400).json({ error: 'Usuário não existe' });
    }
    dev.remove();
    return response
      .status(200)
      .json({ success: 'Usuário deletado com sucesso!' });
  },
};
