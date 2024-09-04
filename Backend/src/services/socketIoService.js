function handleSocketConnection(io, socket) {
  console.log("A user connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`user ${socket.id}  joined in chat: ${chatId}`);
  });
}
export default handleSocketConnection;
