import { useCallback } from 'react';
import { IApplication, ICall, IConfig, IConversation, IMessage, IAppPhoneNumber, IPhoneNumber } from '../Types';

const API_HOSTNAME = process.env.REACT_APP_API_HOSTNAME || '';
const API_KEY_HEADER = 'X-API-KEY';

const apiKey ='ddd';

function useApi() {

  const fetchWithAuth = useCallback((input: RequestInfo, init?: RequestInit | undefined) => {

    let newInit = { headers: { [API_KEY_HEADER]: apiKey } };

    if (init) {

      newInit = {
        ...init,
        ...{
          'headers': { ...init.headers, ...{ [API_KEY_HEADER]: apiKey } }
        }
      }

    }

    return fetch(input, newInit);

  }, []);

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

  const sendMessage = useCallback(async ({ from, to, body }) => {

    const result = await postWithAuth(`${API_HOSTNAME}/api/v1/message`, {
      from: from,
      to: to,
      body: body
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

    const result = await postWithAuth(`${API_HOSTNAME}/api/v1/phone`, {
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

    const result = await postWithAuth(`${API_HOSTNAME}/api/v1/phone/${id}`, {
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

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/phone/${id}`, {
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

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/call/${id}`, {
      method: "DELETE"
    });

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const checkApiKey = useCallback(async (apiKey) => {

    const result = await fetch(`${API_HOSTNAME}/api/v1`, { headers: { [API_KEY_HEADER]: apiKey } });
    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, []);



  const getAllPhone = useCallback(async () => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/phone`);
    const data = await result.json();

    if (result.ok) {

      return data.map((item: any) => {
        return {
          ...item,
          created_on: new Date(item.created_on)
        }
      }) as IAppPhoneNumber[];

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getAllApplication = useCallback(async () => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/twilio/application`);
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

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/twilio/application/${sid}`);
    const data = await result.json();

    if (result.ok) {
      return data as IApplication;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getAllNumber = useCallback(async (numbers?: string[]) => {

    const result = await postWithAuth(`${API_HOSTNAME}/api/v1/twilio/number`, {
      phoneNumbers: numbers
    });

    const data = await result.json();

    if (result.ok) {

      return data.map((item: any) => {
        return {
          ...item,
          dateUpdated: new Date(item.dateUpdated),
          dateCreated: new Date(item.dateCreated)
        }
      }) as IPhoneNumber[];

    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const createApplication = useCallback(async ({ friendlyName }: { friendlyName: string }) => {

    const result = await postWithAuth(`${API_HOSTNAME}/api/v1/twilio/application`, {
      friendlyName: friendlyName
    });
    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const getPhoneById = useCallback(async (phone_id: number) => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/phone/${phone_id}`);
    const data = await result.json();

    if (result.ok) {

      return data as IAppPhoneNumber;

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getConfiguration = useCallback(async () => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/configuration`);
    const data = await result.json();

    if (result.ok) {
      return data as IConfig;

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const setConfiguration = useCallback(async (sid: string) => {

    const result = await postWithAuth(
      `${API_HOSTNAME}/api/v1/configuration`, {
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

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/message/phone/${phone_id}/conversation/${contact_number}`);
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


  const getConversationListByPhoneId = useCallback(async (phone_id: number) => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/message/phone/${phone_id}/conversation`);
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

  const getCallListByPhoneId = useCallback(async (phone_id: number) => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/call/phone/${phone_id}`);
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

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/voice/generateToken`);
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
    getConversationListByPhoneId,
    checkApiKey,
    addPhone,
    updatePhone,
    deletePhone,
    getPhoneById,
    getCallListByPhoneId,
    getConfiguration,
    setConfiguration,
    getAllApplication,
    getApplicationById,
    createApplication,
    getAllNumber,
    deleteCall
  };
}




export default useApi;