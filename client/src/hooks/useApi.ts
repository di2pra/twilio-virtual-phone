import { useCallback, useContext } from 'react';
import { ApiKeyContext } from '../providers/ApiKeyProvider';

const API_HOSTNAME = process.env.REACT_APP_API_HOSTNAME || '';

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

  const {apiKey} = useContext(ApiKeyContext);

  const fetchWithAuth = useCallback((input: RequestInfo, init?: RequestInit | undefined) => {
    if (init) {

      const newInit = {
        ...init,
        ...{
          'headers': {...init.headers, ...{'X-API-KEY': apiKey}}
        }
      }
      return fetch(input, newInit);
    } else {
      return fetch(input, { headers: { 'X-API-KEY': apiKey } })
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

    return {
      ...data,
      created_on: new Date(data.created_on)
    };

  }, [fetchWithAuth]);


  const getAllPhone = useCallback(async () => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/phone`);
    const data = await result.json();

    return data.map((item: any) => {
      return {
        ...item,
        created_on: new Date(item.created_on)
      }
    }) as IPhone[];

  }, [fetchWithAuth]);


  const getMessageByConversation = useCallback(async ({ phone_id, contact_number }) => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/message/phone/${phone_id}/conversation/${contact_number}`);
    const data = await result.json();

    return data.map((item: any) => {
      return {
        ...item,
        created_on: new Date(item.created_on)
      }
    }) as IMessage[];

  }, [fetchWithAuth]);


  const getConversationListByPhoneId = useCallback(async (phone_id: number) => {

    const result = await fetchWithAuth(`${API_HOSTNAME}/api/v1/message/phone/${phone_id}/conversation`);
    const data = await result.json();

    return data.map((item: any) => {
      return {
        ...item,
        created_on: new Date(item.created_on)
      }
    }) as IConversation[];

  }, [fetchWithAuth]);


  return {
    sendMessage,
    getAllPhone,
    getMessageByConversation,
    getConversationListByPhoneId
  };
}




export default useApi;