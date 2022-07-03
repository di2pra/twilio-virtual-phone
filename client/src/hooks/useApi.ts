import { useOktaAuth } from '@okta/okta-react';
import { useCallback } from 'react';
import { IAccount, IApplication, ICall, IConfig, IConversation, IMessage, ITwilioPhoneNumber } from '../Types';

function useApi() {

  const { authState } = useOktaAuth();

  const fetchWithAuth = useCallback((input: RequestInfo, init?: RequestInit | undefined) => {

    let newInit = {};

    if (authState && authState.accessToken) {
      newInit = { headers: { Authorization: 'Bearer ' + authState.accessToken.accessToken } };

      if (init) {

        newInit = {
          ...init,
          ...{
            'headers': { ...init.headers, ...{ Authorization: 'Bearer ' + authState.accessToken.accessToken } }
          }
        }

      }
    }

    return fetch(input, newInit);

  }, [authState]);

  const postWithAuth = useCallback(async (input: RequestInfo, body: object) => {

    const init = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }

    return fetchWithAuth(input, init)

  }, [fetchWithAuth]);

  const putWithAuth = useCallback(async (input: RequestInfo, body: object) => {

    const init = {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }

    return fetchWithAuth(input, init)

  }, [fetchWithAuth]);

  const sendMessage = useCallback(async ({ from_sid, to_number, body }) => {

    const result = await postWithAuth(`/api/v1/message`, {
      from_sid,
      to_number,
      body
    });

    const data = await result.json();

    if (result.ok) {
      return {
        ...data,
        created_on: new Date(data.created_on)
      };
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const addPhone = useCallback(async (sid: string) => {

    const result = await postWithAuth(`/api/v1/phone`, {
      sid: sid
    });

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);


  const updatePhone = useCallback(async ({ id, alias }) => {

    const result = await postWithAuth(`/api/v1/phone/${id}`, {
      alias: alias
    });

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const deletePhone = useCallback(async (id) => {

    const result = await fetchWithAuth(`/api/v1/phone/${id}`, {
      method: "DELETE"
    });

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const deleteCall = useCallback(async (id) => {

    const result = await fetchWithAuth(`/api/v1/call/${id}`, {
      method: "DELETE"
    });

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);



  const getAllPhone = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/phone`);
    const data = await result.json();

    if (result.ok) {

      return data as ITwilioPhoneNumber[];

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);


  const getAllNumber = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/twilio/number`);
    const data = await result.json();

    if (result.ok) {

      return data as ITwilioPhoneNumber[];

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getAllApplication = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/twilio/application`);
    const data = await result.json();

    if (result.ok) {

      return data.map((item: any) => {
        return {
          ...item,
          dateUpdated: new Date(item.dateUpdated),
          dateCreated: new Date(item.dateCreated)
        }
      }) as IApplication[];

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getApplicationById = useCallback(async (sid: string) => {

    const result = await fetchWithAuth(`/api/v1/twilio/application/${sid}`);
    const data = await result.json();

    if (result.ok) {
      return data as IApplication;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const createApplication = useCallback(async ({ friendlyName }: { friendlyName: string }) => {

    const result = await postWithAuth(`/api/v1/twilio/application`, {
      friendlyName: friendlyName
    });
    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const getPhoneById = useCallback(async (sid: number) => {

    const result = await fetchWithAuth(`/api/v1/phone/${sid}`);
    const data = await result.json();

    if (result.ok) {

      return data as ITwilioPhoneNumber;

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getConfiguration = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/configuration`);
    const data = await result.json();

    if (result.ok) {
      return data as IConfig;

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getAccount = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/account`);
    const data = await result.json();

    if (result.ok) {
      return data as IAccount;

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const setAccount = useCallback(async ({ account_sid, api_key, api_secret }: { account_sid: string, api_key: string, api_secret: string }) => {

    const result = await postWithAuth(
      `/api/v1/account`, { account_sid, api_key, api_secret });

    const data = await result.json();

    if (result.ok) {
      return data as IAccount;

    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const updateAccountTwimlApp = useCallback(async ({ twiml_app_sid }: { twiml_app_sid: string }) => {

    const result = await putWithAuth(
      `/api/v1/account`, { twiml_app_sid });

    const data = await result.json();

    if (result.ok) {
      return data as IAccount;

    } else {
      throw new Error(data.message);
    }

  }, [putWithAuth]);

  const setConfiguration = useCallback(async (sid: string) => {

    const result = await postWithAuth(
      `/api/v1/configuration`, {
      sid: sid
    });

    const data = await result.json();

    if (result.ok) {
      return data as IConfig;

    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);


  const getMessageByConversation = useCallback(async ({ phone_id, contact_number }) => {

    const result = await fetchWithAuth(`/api/v1/message/phone/${phone_id}/conversation/${contact_number}`);
    const data = await result.json();

    if (result.ok) {
      return data.map((item: any) => {
        return {
          ...item,
          created_on: new Date(item.created_on)
        }
      }) as IMessage[];
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);


  const getConversationListByPhoneSid = useCallback(async (phone_sid: string) => {

    const result = await fetchWithAuth(`/api/v1/message/phone/${phone_sid}/conversation`);
    const data = await result.json();

    if (result.ok) {
      return data.map((item: any) => {
        return {
          ...item,
          created_on: new Date(item.created_on)
        }
      }) as IConversation[];
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getCallListByPhoneSid = useCallback(async (phone_sid: string) => {

    const result = await fetchWithAuth(`/api/v1/call/phone/${phone_sid}`);
    const data = await result.json();

    if (result.ok) {
      return data.map((item: any) => {
        return {
          ...item,
          created_on: new Date(item.created_on)
        }
      }) as ICall[];
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getVoiceAccessToken = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/twilioClient/generateToken`);
    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);


  return {
    getVoiceAccessToken,
    sendMessage,
    getAllPhone,
    getMessageByConversation,
    getConversationListByPhoneSid,
    addPhone,
    updatePhone,
    deletePhone,
    getPhoneById,
    getCallListByPhoneSid,
    getConfiguration,
    setConfiguration,
    getAllApplication,
    getApplicationById,
    createApplication,
    deleteCall,
    getAccount,
    setAccount,
    getAllNumber,
    updateAccountTwimlApp
  };
}




export default useApi;