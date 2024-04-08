import SocketProvider from '@/context/socketContext';
import React from 'react';

const AuthMiddleware = ({ children}: {children: React.ReactNode}) => {


    return (
        <SocketProvider>
            {children}
        </SocketProvider>
    )
}

export default AuthMiddleware;