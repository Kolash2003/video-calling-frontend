import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const CreateRoom: React.FC = () => {

    const { socket } = useContext(SocketContext);

    const initRoom = () => {
        socket.emit("create-room")
    }

    return (
        <div>
            <button
                onClick={initRoom}
                className="btn btn-secondary"
            >
                Start a new meeting in a new Room
            </button>
        </div>
    )
}

export default CreateRoom;