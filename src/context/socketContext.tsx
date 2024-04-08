import React, { useMemo } from 'react';
import { io, Socket} from 'socket.io-client';

interface SocketContextType {
    socket: Socket;
}

const SocketContext = React.createContext<SocketContextType | null>(null);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {

    const socket = useMemo(() => io('http://localhost:3001'),[]);

    const socketContextValue: SocketContextType = {
        socket: socket,
    };

    return (
        <div>
            <SocketContext.Provider value={socketContextValue}>
                {children}
            </SocketContext.Provider>
        </div>
    )
}

export const useSocket = () => React.useContext(SocketContext);

export default SocketProvider;