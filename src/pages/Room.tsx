import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const Room: React.FC = () => {

    const { id } = useParams();
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        // emitting this event so that either creator of room or other users can join the room
        // server knows that a new user has joined the room
        socket.emit("joined-room", { roomId: id });
    }, []);

    return (
        <div>
            <h1>
                Room: {id}
            </h1>
        </div>
    )
}

export default Room;