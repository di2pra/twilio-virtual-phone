import oktaConfig from "../oktaConfig.js";
import { oktaJwtVerifier } from "../providers/oktaClient.js";
import Redis from "../providers/redisClient.js";

type IUserTokenPayload = {
  accessToken: string
}

export default class SocketController {

  static onUserToken = async (clientId: string, payload: IUserTokenPayload) => {
    try {
      const audience = oktaConfig.resourceServer.assertClaims.aud;
      const result = await oktaJwtVerifier.verifyAccessToken(payload.accessToken, audience);

      const redisClient = await Redis.getClient();
      await redisClient.set(result.claims.sub, clientId);
      await redisClient.set(clientId, result.claims.sub);

      console.log(`${result.claims.sub} successfully mapped !`)

    } catch (error) {

    }
  }

  /*static onDisconnect = async () => {

    const redisClient = await Redis.getClient();
    const username = await redisClient.get(client.id);

    if (username) {
      await redisClient.del(username);
    }

    await redisClient.del(client.id);
    console.log('user disconnected');

  }*/

}