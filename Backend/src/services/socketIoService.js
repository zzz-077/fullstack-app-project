function handleSocketConnection(io, socket) {
  console.log("A user connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`user ${socket.id}  joined in chat: ${chatId}`);
  });
  socket.on("disconnect", () => console.log("user disconnected:", socket.id));
}
export default handleSocketConnection;
