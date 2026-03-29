import React, { useEffect, useState } from "react";
import socketIoClient from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";
import { peerReducer } from "../reducers/peerReducer";
import { useReducer } from "react";
import { addPeerAction } from "../actions/peerActions";

const WS_Server = "http://localhost:3000";

const socket = socketIoClient(WS_Server);

interface Props {
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate(); // will help us to programatically handle navigation

    // state variable to store the userId
    const [user, setUser] = useState<Peer>(); // new peer user
    const [stream, setStream] = useState<MediaStream>();

    const [peers, dispatch] = useReducer(peerReducer, {}); // peers => state

    const fetchParticipantList = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
        console.log("Fetched room participants");
        console.log(roomId, participants);
    }

    const fetchUserFeed = async () => {
        // this is not a react thing, its a browser thing
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(stream);
    }

    useEffect(() => {

        const userId = UUIDv4();
        const newPeer = new Peer(userId, {
            host: 'localhost',
            port: 9000,
            path: '/myapp'
        });

        setUser(newPeer);

        fetchUserFeed();

        const enterRoom = ({ roomId }: { roomId: string }) => {
            navigate(`/room/${roomId}`);
        };

        // Transfer the user to room page when we collect the create-room event
        socket.on("room-created", enterRoom);
        socket.on("get-users", fetchParticipantList);

    }, []);

    useEffect(() => {
        if (!user || !stream) return;

        socket.on("user-joined", ({ peerId }) => {
            const call = user.call(peerId, stream);
            console.log("Calling the new Peer", peerId);
            call.on("stream", (remoteStream) => {
                dispatch(addPeerAction(peerId, remoteStream));
            });

        });

        user.on("call", (call) => {
            // what to do when the other peers on the group call you when u joined
            console.log("receiving a call");
            call.answer(stream);
            call.on("stream", (remoteStream) => {
                dispatch(addPeerAction(call.peer, remoteStream));
            })
        })

        socket.emit("ready");

    }, [user, stream])

    return (
        <SocketContext.Provider value={{ socket, user, stream, peers }}>
            {children}
        </SocketContext.Provider>
    );
};
