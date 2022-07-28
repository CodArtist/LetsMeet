import React, { createRef, useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import Video from '../components/Video';
import BottomControlBar from '../components/BottomControlBar';
import ShareMeetingLinkCard from '../components/ShareMeetingLinkCard';
import CallsBottomModal from '../components/CallsBottomModal';
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid';



export default function AdminRoom() {
  const router = useRouter()
  const username = router.query.username
  const [mySocketId, setmySocketId] = useState('')
  const socket = io.connect(process.env.NEXT_PUBLIC_API_URL);

  const [screenShare, setscreenShare] = useState(false)
  const [showCam, setshowCam] = useState(true)
  const [showAudio, setshowAudio] = useState(true)
  const [call, _setcall] = useState([])
  const [peersConnections, _setpeersConnections] = useState([])
  const peersConnectionsRef = useRef(peersConnections)
  const setpeersConnections = (data) => {
    peersConnectionsRef.current = data
    _setpeersConnections(data)
  }
  const callRef = useRef(call)
  const currentPeerRef = useRef(null)
  const [peerId, setpeerId] = useState('')
  const [videoRefs, _setvideoRefs] = useState([])
  const videoRefs_Ref = useRef(videoRefs)
  const setvideoRefs = (data) => {
    videoRefs_Ref.current = data
    _setvideoRefs(data)
  }
  const [videos, _setvideos] = useState([])
  const videosRef = useRef(videos)
  const [myRoomId, setmyRoomId] = useState('')

  const setvideos = (data) => {
    videosRef.current = data
    _setvideos(data)
  }

  const setcall = (data) => {
    callRef.current = data
    _setcall(data)
  }
  const myVideo = useRef(null)
  const [anyCalls, setanyCalls] = useState(false)


  useEffect(() => {
    videosRef.current[0] = <Video reference={myVideo}
      key={uuid()}
      id={uuid()}
      name={"You"}
      muted={true}
      flipped={true}
      screenShare={screenShare} />
    setvideos([...videosRef.current])
  }, [screenShare])



  useEffect(() => {

    setvideos([

      <Video reference={myVideo}
        key={uuid()}
        id={uuid()}
        name={"You"}
        muted={true}
        flipped={true}
        screenShare={screenShare} />
    ])



    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer();
      peer.on('open', function (id) {

        setpeerId(id)
      });
      currentPeerRef.current = peer
    })
    initialiseCam()

    socket.on('connect', () => {

      setmySocketId(socket.id)
      socket.emit("joinRoom", { roomId: uuid() })
      // an alphanumeric id...
    });

    socket.on("roomJoined", ({ roomId }) => {
      setmyRoomId(roomId)
    })

    socket.on("callUser", ({ fromUserId, fromSignal, UserName }) => {
      setcall([...callRef.current, { "id": uuid(), "accepted": false, "socketId": fromUserId, "signal": fromSignal, username: UserName }])
      setanyCalls(true)
    })

    socket.on("userDisconnected", ({ socketId }) => {

      var deleteVideoIndex
      var deleteVideoReferenceIndex=-2
      videosRef.current.map((v, i) => {
       if(v!=null)
       deleteVideoReferenceIndex+=1
        if (v != null && v.props.socketId === socketId) {
          deleteVideoIndex = i
        }
      })
      var deleteCallIndex
      callRef.current.map((c, i) => {

        if (c.socketId === socketId) {
          deleteCallIndex = i
        }
      })
      videosRef.current.splice(deleteVideoIndex, 1, null)
      videoRefs_Ref.current.splice(deleteVideoReferenceIndex, 1)
      callRef.current.splice(deleteCallIndex, 1)


      setvideos([...videosRef.current])
      setvideoRefs([...videoRefs_Ref.current])
      setcall([...callRef.current])
    })
  }, [])



  function declineRequest(c) {
    socket.emit("answerCall", { ToUserId: c.socketId, Declined: true })

    var index = callRef.current.map(x => {
      return x.id;
    }).indexOf(c.id);
    callRef.current.splice(index, 1)
    setcall([...callRef.current])

    var temp = false
    callRef.current.map((ca, i) => {
     
      if (!ca.accepted) {
        temp = true
  
    }
    })
    setanyCalls(temp)

  }

  function acceptRequest(c) {
    var index = callRef.current.map(x => {
      return x.id;
    }).indexOf(c.id);
    callRef.current[index].accepted = true

    
    var temp = false
    callRef.current.map((ca, i) => {
      if(i!=index)
      {if (!ca.accepted) {
        temp = true
      }
    }
    })
    setanyCalls(temp)

    var peerIds = []
    var names = []
    var socketIds = []
    names.push(username)
    peerIds.push(peerId)
    socketIds.push(mySocketId)
    for (var i = 0; i < callRef.current.length; i++) {
      if (c.id != callRef.current[i].id && callRef.current[i].accepted) {
        peerIds.push(callRef.current[i].signal)
        names.push(callRef.current[i].username)
        socketIds.push(callRef.current[i].socketId)
      }
    }
    socket.emit("answerCall", { ToUserId: c.socketId, UsersPeerIds: peerIds, UserNames: names, UserSocketIds: socketIds, Declined: false })


    // setcall(callRef.current)

    currentPeerRef.current.on("call", (c) => {
      var containskey = false
      videosRef.current.map((e) => {


        // console.log(e.props)
        if (e != null && e.props.identity === c.metadata.peerId)
          containskey = true

      })
      var ref = new createRef()
      var video = <Video
        key={uuid()}
        id={uuid()}
        identity={c.metadata.peerId}
        socketId={c.metadata.socketId}
        name={c.metadata.name}
        reference={ref}
      />

      if (!containskey) {
        setvideos([...videosRef.current, video])
        setvideoRefs([...videoRefs_Ref.current, ref])
        c.answer(myVideo.current.srcObject)
        c.on("stream", (remoteStream) => {
          c.peerConnection.getSenders()[1].replaceTrack(myVideo.current.srcObject.getTracks()[1])
          peersConnectionsRef.current.push(c.peerConnection)
          setpeersConnections([...peersConnectionsRef.current])
          // videoRefs_Ref.current[videoRefs_Ref.current.length - 1].current.srcObject = remoteStream
          ref.current.srcObject = remoteStream
        });
      }

    })
  }








  function initialiseCam() {
    navigator.mediaDevices.getUserMedia({
      video: {
        aspectRatio: 16 / 9
      },
      audio: true
    }).then((stream) => {

      myVideo.current.srcObject = stream
      window.localStream = stream

      peersConnections.map((c) => {
        c.getSenders()[1].replaceTrack(stream.getTracks()[1])
      })

    }).catch((e)=>{
      alert("Please allow webcam permission to continue")
      router.reload()
    })

  }





  return (
    <div className=' h-screen w-screen bg-white'>
      <div className={"grid grid-rows-4 grid-flow-col sm:grid-cols-4 sm:grid-flow-row gap-1 bg-white w-full h-full sm:row-span-6"}>


        {
          videosRef.current.map((v, i) => {
            if (v != null)
              return (
                <div key={v.props.id} className={videoRefs_Ref.current.length === 0 ? ' h-screen w-screen' : ' bg-white p-1 h-full w-full'}
                >
                  {v}
                </div>

              )
          })
        }



        <ShareMeetingLinkCard MeetingLink={`${process.env.NEXT_PUBLIC_APP_URL}/Room/${myRoomId}`} />
        <CallsBottomModal anyCalls={anyCalls} calls={callRef.current} acceptRequest={acceptRequest} declineRequest={declineRequest} />

        <BottomControlBar videoReference={myVideo}
          peersConnections={peersConnectionsRef.current}
          initialiseCam={initialiseCam}
          setscreenShare={setscreenShare}
          screenShare={screenShare}
          showCam={showCam}
          showAudio={showAudio}
          setshowAudio={setshowAudio}
          setshowCam={setshowCam}
        />

      </div>


    </div>
  )
}



