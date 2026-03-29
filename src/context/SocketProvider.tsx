import React, { useEffect, useState } from "react";
import socketIoClient from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";

const WS_Server = "http://localhost:3000";

const socket = socketIoClient(WS_Server);

interface Props {
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate(); // will help us to programatically handle navigation

    // state variable to store the userId
    const [user, setUser] = useState<Peer>(); // new peer user

    const fetchParticipantList = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
        console.log("Fetched room participants");
        console.log(roomId, participants);
    }

    useEffect(() => {

        const userId = UUIDv4();
        const newPeer = new Peer(userId);
        setUser(newPeer);

        const enterRoom = ({ roomId }: { roomId: string }) => {
            navigate(`/room/${roomId}`);
        };

        // Transfer the user to room page when we collect the create-room event
        socket.on("room-created", enterRoom);
        socket.on("get-users", fetchParticipantList);

    }, []);

    return (
        <SocketContext.Provider value={{ socket, user }}>
            {children}
        </SocketContext.Provider>
    );
};
