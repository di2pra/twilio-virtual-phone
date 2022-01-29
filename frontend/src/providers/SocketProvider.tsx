import { createContext, FC, useEffect, useState } from "react";
import { io, Socket} from "socket.io-client";

export const SocketContext = createContext<{
  socket: Socket | null;
}>({
  socket: null
});

const SOCKET_HOSTNAME = process.env.REACT_APP_SOCKET_HOSTNAME || window.location.origin;

const SocketProvider: FC = ({children}) => {

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_HOSTNAME);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{
      socket: socket
    }}>
      {children}
    </SocketContext.Provider>
  );

}

export default SocketProvider;