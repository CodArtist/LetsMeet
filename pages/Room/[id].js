import { CircularProgress } from '@mui/material';
import React, { createRef, useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import BottomControlBar from '../../components/BottomControlBar';
import Video from '../../components/Video';
import WaitingRoomControl from '../../components/WaitingRoomControl';
import { v4 as uuid } from 'uuid';
import {useRouter} from 'next/router'




export default function Room({ id }) {

  const socket = io.connect(process.env.NEXT_PUBLIC_API_URL);
  const router = useRouter()

  const [mySocketId, _setmySocketId] = useState('')
  const mySocketIdRef = useRef(mySocketId)
  const setmySocketId = (data) => {
    mySocketIdRef.current = data
    _setmySocketId(data)
  }


  const [showCam, setshowCam] = useState(true)
  const [showAudio, setshowAudio] = useState(true)


  const [stream, _setstream] = useState(null)
  const streamRef = useRef(stream)
  const setstream = (data) => {
    streamRef.current = data
    _setstream(data)
  }


  const myVideo = useRef(null)

  const [myName, _setmyName] = useState(' ')
  const myNameRef = useRef(myName)
  const setmyName = (data) => {
    myNameRef.current = data
    _setmyName(data)
  }


  const [callDeclined, setcallDeclined] = useState(false)


  const currentPeer = useRef()

  const [videoRefs, _setvideoRefs] = useState([])
  const videoRefs_Ref = useRef(videoRefs)
  const setvideoRefs = (data) => {
    videoRefs_Ref.current = data
    _setvideoRefs(data)
  }


  const [videos, _setvideos] = useState([])
  const videosRef = useRef(videos)
  const setvideos = (data) => {
    videosRef.current = data
    _setvideos(data)
  }


  const [peerId, setpeerId] = useState('')
  const peerIdRef = useRef(peerId)

  const [waiting, setwaiting] = useState(true)

  const [callSent, setcallSent] = useState(false)

  const [screenShare, setscreenShare] = useState(false)



  const [peersConnections, _setpeersConnections] = useState([])
  const peersConnectionsRef = useRef(peersConnections)
  const setpeersConnections = (data) => {
    peersConnectionsRef.current = data
    _setpeersConnections(data)
  }


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

    createMyPeer() // Will create my peer

    socket.on('connect', () => {
      setmySocketId(socket.id)  // Creates My Socket Id
    });

    socket.on("roomJoined", ({ roomId }) => {
      setwaiting(false)

    })

    socket.on("userDisconnected", ({ socketId }) => {
      var deleteVideoIndex
      var deleteVideoReferenceIndex = -2
      videosRef.current.map((v, i) => {
        if (v != null)
          deleteVideoReferenceIndex += 1
        if (v != null && v.props.socketId === socketId) {
          deleteVideoIndex = i
        }
      })

      videosRef.current.splice(deleteVideoIndex, 1, null)
      videoRefs_Ref.current.splice(deleteVideoReferenceIndex, 1)


      setvideos([...videosRef.current])
      setvideoRefs([...videoRefs_Ref.current])
    })

    listenToCallAcceptedByAdmin() // listens to admin call Accepted through socket


    initialiseCam() // initialises my webCam

  }, [])

  useEffect(() => {
    if (mySocketId != '' && stream != null && peerId != '') {
      listenToOtherPeerCalls() // listens to other peer calls or connection of users in meeting
    }
  }, [mySocketId, stream, peerId])


  function initialiseCam() {
    navigator.mediaDevices.getUserMedia({
      video: {
        aspectRatio: 16 / 9
      },
      audio: true
    }).then((stream) => {
      setstream(stream)
      peersConnections.map((c) => {
        c.getSenders()[1].replaceTrack(stream.getTracks()[1])
      })
      if (myVideo.current != null) {
        myVideo.current.srcObject = stream
      }


    })
    .catch((e)=>{
      
      alert("Please allow webcam permission to continue")
      router.reload()
    })

  }

  function createMyPeer() {
    import("peerjs").then(({ default: Peer }) => {
      const peer = new Peer()
      peer.on('open', function (id) {
        setpeerId(id)
        peerIdRef.current = id
      });
      currentPeer.current = peer
    })
  }

  function callMeetingAdmin() {
    if (mySocketId != '' && stream != null && peerId != '') {
      socket.emit("callUser", { ToRoomId: id, fromUserId: mySocketId, fromSignal: peerId, UserName: myName })
    }
  }

  function listenToCallAcceptedByAdmin() {
    socket.on("callAccepted", ({ UsersPeerIds, UserNames, UserSocketIds, Declined }) => {

      if (!Declined) {
        socket.emit("joinRoom", { roomId: id })
        UsersPeerIds.map((s, i) => {
          var ref = new createRef()
          var video = <Video identity={s}
            key={uuid()}
            id={uuid()}
            reference={ref}
            name={UserNames[i]}
            socketId={UserSocketIds[i]}
          />

          setvideos([...videosRef.current, video])
          setvideoRefs([...videoRefs_Ref.current, ref])

          var options = { metadata: { "peerId": peerIdRef.current, "socketId": mySocketIdRef.current, "name": myNameRef.current } };
          const call = currentPeer.current.call(s, myVideo.current.srcObject, options);
          peersConnectionsRef.current.push(call.peerConnection)
          setpeersConnections([...peersConnectionsRef.current])
          call.on("stream", (remoteStream) => {

            videoRefs_Ref.current[i].current.srcObject = remoteStream
          });

        })
      }
      else {
        setcallDeclined(true)
      }

    })


  }

  function listenToOtherPeerCalls() {
    currentPeer.current.on("call", (c) => {
      console.log("gotcall")
      var ref = createRef()
      var video = <Video identity={c.metadata.peerId}
        key={uuid()}
        id={uuid()}
        reference={ref}
        name={c.metadata.name}
        socketId={c.metadata.socketId}
      />
      setvideos([...videosRef.current, video])
      setvideoRefs([...videoRefs_Ref.current, ref])
      c.answer(stream)
      c.on("stream", (remoteStream) => {
        c.peerConnection.getSenders()[1].replaceTrack(myVideo.current.srcObject.getTracks()[1])
        peersConnectionsRef.current.push(c.peerConnection)
        setpeersConnections([...peersConnectionsRef.current])
        ref.current.srcObject = remoteStream
      });

    })
  }




  return (
    <div className={waiting ? '' :
      'h-screen w-screen bg-white'}>

      <div className={
        waiting ? 'flex flex-col space-y-7 p-5 items-center h-screen w-screen bg-white' :
         "grid grid-rows-4 grid-flow-col sm:grid-cols-4 sm:grid-flow-row gap-1 bg-white w-full h-full sm:row-span-6 "}
      >


        {waiting ? <div className='text-black'>{id}</div> : <></>}



        {videosRef.current.map((v) => {

          if (v != null)
            return (
              <div key={v.props.id} className={waiting ? 'w-1/2 h-1/3' : 'p-1 bg-white'} >
                {v}
              </div>

            )
        })
        }


        {waiting ? <WaitingRoomControl videoReference={myVideo}
          showCam={showCam}
          showAudio={showAudio}
          setshowAudio={setshowAudio}
          setshowCam={setshowCam} /> : <></>}
        {waiting ?
          callDeclined ? <div className=' text-red-600'> Meeting Admin has Declined your request</div> :
            !callSent ?
              <div className=' flex flex-col justify-center items-center space-y-8'>
                <input className=' bg-gray-200 p-3 outline-none border-none text-black' type={'text'} placeholder={'Enter your username'} onChange={(e) => {
                  setmyName(e.target.value)
                }} />
                <div className='flex flex-row bg-purple-600 rounded-full shadow-lg p-4 justify-center items-center text-white w-44 cursor-pointer'
                  onClick={() => {
                    if (myName.trim().length == 0) {
                      alert("Please Provide Username")
                    }
                    else {
                      setcallSent(true)
                      callMeetingAdmin()
                    }
                  }}>
                  Join
                </div>
              </div> :
              <div className='flex flex-col justify-center items-center space-y-16'>


                <div className=' text-black'> Meeting Admin will let you in soon</div>
                <CircularProgress />
              </div>
          : <></>
        }




        {waiting ? <></> : <BottomControlBar videoReference={myVideo}
          peersConnections={peersConnectionsRef.current}
          initialiseCam={initialiseCam}
          screenShare={screenShare}
          setscreenShare={setscreenShare}
          showCam={showCam}
          showAudio={showAudio}
          setshowAudio={setshowAudio}
          setshowCam={setshowCam} />
        }
      </div>

    </div>


  )
}

export async function getServerSideProps({ query }) {
  const id = query.id
  if (id)
    return {
      props: { id }
    }
  else {
    return {
      notFound: true
    }
  }
}


