const btnNewRoom = document.querySelector('#newRoom');
const btnJoinRoom = document.querySelector('#joinRoom');
const joinRoomValue = document.querySelector('#joinRoomValue');
const roomId = document.querySelector('#roomId');
const root = document.querySelector('#root');

const newRoom = async e => {
  const res = await fetch('/room');
  const { ROOM_ID } = await res.json();
  console.log(ROOM_ID)
  roomId.textContent = ROOM_ID;
  root.innerHTML = `<div id="gridVideo"></div>`;
  startApp(ROOM_ID);
}

const joinRoom = async e => {
  if (joinRoomValue.value == '') return;
  const res = await fetch(`/joinRoom/${joinRoomValue.value}`);
  const { ROOM_ID } = await res.json();
  roomId.textContent = ROOM_ID;
  root.innerHTML = `<div id="gridVideo"></div>`;
  startApp(ROOM_ID);
}
const startApp = ROOM_ID => {
  const socket = io('/');
  const videoGrid = document.querySelector('#gridVideo')
  const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
  })
  const myVideo = document.createElement('video')
  myVideo.muted = true
  const peers = {}
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on('user-connected', userId => {
      console.log('userConected ', userId)
      connectToNewUser(userId, stream)
    })
  })


  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })

  myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
  })


  const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })

    peers[userId] = call

  }

  const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }
}

btnNewRoom.addEventListener('click', newRoom);
btnJoinRoom.addEventListener('click', joinRoom);

