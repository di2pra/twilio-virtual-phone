const getConfiguration = (client) => {
  return async (request, response, next) => {

    try {

      const value = await client.get('configuration');

      if (value) {
        response.status(200).json(JSON.parse(value));
      } else {
        response.status(200).json(null);
      }

    } catch (error) {

      next(error);

    }

  }
}

const setConfiguration = (client, ) => {

  return async (request, response, next) => {

    try {

      await client.set('configuration', JSON.stringify({ apiKey: `fdsfsfsfsd` }));

      const value = await client.get('configuration');

      response.status(200).json(JSON.parse(value));

    } catch (error) {

      next(error);

    }

  }
}

module.exports = {
  getConfiguration,
  setConfiguration
}
