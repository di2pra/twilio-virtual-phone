import { useCallback, useContext } from 'react';
import { ApiKeyContext } from '../providers/ApiKeyProvider';

const API_HOSTNAME = process.env.REACT_APP_API_HOSTNAME || '';
const API_KEY_HEADER = 'X-API-KEY';

export interface IPhone {
  phone_id: number;
  alias: string;
  number: string;
  created_on: Date;
}

export interface IMessage {
  message_id: number;
  from_number: string;
  from_phone_id: number | null;
  to_number: string;
  to_phone_id: number | null;
  body: string;
  created_on: Date;
}

export interface IConversation {
  contact_number: string;
  body: string;
  created_on: Date;
}

function useApi() {

  const { apiKey } = useContext(ApiKeyContext);

  const fetchWithAuth = useCallback((input: RequestInfo, init?: RequestInit | undefined) => {
    if (init) {

      const newInit = {
        ...init,
        ...{
          'headers': { ...init.headers, ...{ [API_KEY_HEADER]: apiKey } }
        }
      }
      return fetch(input, newInit);
    } else {
      return fetch(input, { headers: { [API_KEY_HEADER]: apiKey } })
    }

  }, [apiKey])

  const sendMessage = useCallback(async ({ from, to, body }) => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/message`,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: from,
          to: to,
          body: body
        })
      }
    );

    const data = await result.json();

    if(result.ok) {
      return {
        ...data,
        created_on: new Date(data.created_on)
      };
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const createPhone = useCallback(async ({ alias, number }) => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/phone`,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alias: alias,
          number: number
        })
      }
    );

    const data = await result.json();

    if(result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);


  const updatePhone = useCallback(async ({ id, alias }) => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/phone/${id}`,
      {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alias: alias
        })
      }
    );

    const data = await result.json();

    if(result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);


  const checkApiKey = useCallback(async (apiKey) => {

    const result = await fetch(`${API_HOSTNAME}/api/v1`, {headers: {[API_KEY_HEADER]: apiKey}});
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
      }) as IPhone[];

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getPhoneById = useCallback(async (phone_id : number) => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/phone/${phone_id}`);
    const data = await result.json();

    if (result.ok) {

      return data as IPhone;

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);


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


  return {
    sendMessage,
    getAllPhone,
    getMessageByConversation,
    getConversationListByPhoneId,
    checkApiKey,
    createPhone,
    updatePhone,
    getPhoneById
  };
}




export default useApi;