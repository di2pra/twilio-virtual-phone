import { createContext, FC } from "react";
import { io, Socket} from "socket.io-client";

const SOCKET_HOSTNAME = process.env.REACT_APP_SOCKET_HOSTNAME || window.location.origin;
const newSocket = io(SOCKET_HOSTNAME);

export const SocketContext = createContext<{
  socket: Socket;
}>({
  socket: newSocket
});

const SocketProvider: FC = ({children}) => {

  return (
    <SocketContext.Provider value={{
      socket: newSocket
    }}>
      {children}
    </SocketContext.Provider>
  );

}

export default SocketProvider;