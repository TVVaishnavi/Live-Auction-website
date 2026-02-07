import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: true,
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ socket disconnected:", reason);
});


export default socket;
