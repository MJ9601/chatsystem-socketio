export const serviceIds = {
  authService: 'AUTH_SERVICE',
  userService: 'USER_SERVICE',
  msgService: 'MESSAGE_SERVICE',
  chatService: 'CHAT_SERVICE',
};

export const socketKeys = {
  createRoomPr: 'CREATE_ROOM_PRIVATE',
  createRoomPb: 'CREATE_ROOM_PUBLIC',
  joinRoom: 'JOIN_ROOM',
  leaveRoom: 'LEAVE_ROOM',
  removeRoom: 'REMOVE_ROOM',
  newMessage: 'NEW_MESSAGE',
  delMessage: 'DEL_MESSAGE',
  editMessage: 'EDIT_MESSAGE',
  kickUser: 'KICK_USER_FROM_ROOM',
  onMessage: 'ON_MESSAGE',
  connection: 'connection',
  disconnect: 'disconnect',
  error: 'ERROR',
  roomCreated: 'ROOM_CREATED',
  joinedRoom: 'JOINED_ROOM',
  leftRoom: 'LEFT_ROOM',
  storedMsg: 'STORED_MESSAGE',
  getUserInRoom: 'USER_IN_ROOM',
  roomUsers: 'ROOM_USERS',
};
