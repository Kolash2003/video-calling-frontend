import React, { useEffect } from "react";
import socketIoClient from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { useNavigate } from "react-router-dom";

const WS_Server = "http://localhost:3000";

const socket = socketIoClient(WS_Server);

interface Props {
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate(); // will help us to programatically handle navigation
    useEffect(() => {
        const enterRoom = ({ roomId }: { roomId: string }) => {
            navigate(`/room/${roomId}`)
        }
        // we will transfer the user to room page when we collect the create-room event
        socket.on("room-created", enterRoom);

    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
