import { useOktaAuth } from '@okta/okta-react';
import { createContext, FC, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_HOSTNAME = process.env.REACT_APP_SOCKET_HOSTNAME || window.location.origin;

export const SocketContext = createContext<{
  socket: Socket | null;
}>({
  socket: null
});

const SocketProvider: FC = ({ children }) => {

  const { authState } = useOktaAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {

    let newSocket: Socket;

    if (authState) {

      newSocket = io(SOCKET_HOSTNAME);

      newSocket.on('connect', () => {
        newSocket.emit('userToken', newSocket.id, {
          accessToken: authState.accessToken?.accessToken
        })
      })

      setSocket(newSocket);

    }

    return () => {
      newSocket.disconnect();
    }

  }, [authState]);

  return (
    <SocketContext.Provider value={{
      socket: socket
    }}>
      {children}
    </SocketContext.Provider>
  );

}

export default SocketProvider;