import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import UserFeedPlayer from "../components/UserFeedPlayer";

const Room: React.FC = () => {

    const { id } = useParams();
    const { socket, user, stream, peers } = useContext(SocketContext);

    useEffect(() => {
        // emitting this event so that either creator of room or other users can join the room
        // server knows that a new user has joined the room
        if (user) socket.emit("joined-room", { roomId: id, peerId: user.id || user._id });

        const handleUserJoined = ({ roomId, peerId }: { roomId: string, peerId: string }) => {
            console.log("New user has joined room", roomId, peerId);
        };

        socket.on("user-joined", handleUserJoined);

        return () => {
            socket.off("user-joined", handleUserJoined);
        }

    }, [id, user, socket]);


    return (
        <div>
            <h1>
                Room: {id}
                Your own user feed
                <UserFeedPlayer stream={stream} />

                <br />

                <div>
                    Other users feed
                    {Object.keys(peers).map((peerId) => (
                        <>
                            <UserFeedPlayer key={peerId} stream={peers[peerId].stream} />
                        </>
                    ))}
                </div>
            </h1>
        </div>
    )
}

export default Room;