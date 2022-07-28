import React from 'react'

import { AiOutlineAudioMuted,AiFillAudio } from 'react-icons/ai'
import {BsCameraVideoFill,BsCameraVideoOff} from 'react-icons/bs'
import {MdCallEnd,MdScreenShare,MdStopScreenShare} from 'react-icons/md'
import Link from 'next/link'


export default function BottomControlBar({ videoReference,peersConnections,initialiseCam,setscreenShare,screenShare,showCam,showAudio,setshowAudio,setshowCam }) {
    
 
    
    
    const iconSize = 30
    
    function hideOrShowAudio() {

        const mediaStream = videoReference.current.srcObject;
        const tracks = mediaStream.getTracks();
        tracks[0].enabled = !tracks[0].enabled;
        setshowAudio(!showAudio)
    }

    function hideOrShowCam() {
        const mediaStream = videoReference.current.srcObject;
        const tracks = mediaStream.getTracks();
        tracks[1].enabled = !tracks[1].enabled;
        setshowCam(!showCam)
    }

    async function startCapture(displayMediaOptions) {
        let captureStream = null;

        try {
          captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
          videoReference.current.srcObject.getTracks()[1].stop()

        const newStream = new MediaStream()
        newStream.addTrack(videoReference.current.srcObject.getTracks()[0])
        newStream.addTrack(captureStream.getTracks()[0])
        videoReference.current.srcObject = newStream
        videoReference.current.srcObject.getTracks()[1].onended =(e)=>{
            setscreenShare(false)
         initialiseCam()
        
        }
        peersConnections.map((c)=>{
            c.getSenders()[1].replaceTrack(captureStream.getTracks()[0])
        })
      setscreenShare(true)

        } catch(err) {
          console.error(`Error: ${err}`);
         
        }
      }
    return (
        <div className='absolute bottom-5 w-screen pl-10 pr-10 z-20 '>
        <div className=" flex flex-row space-x-8  p-3 w-full bg-white h-16 justify-evenly items-center rounded-full shadow-xl">
            {showCam?<BsCameraVideoFill color='black' size={iconSize} onClick={() => {hideOrShowCam()}} />:<BsCameraVideoOff color='black' size={iconSize}  onClick={() => {
                hideOrShowCam()
            }
                
                } />}
            {showAudio?<AiFillAudio color='black' size={iconSize} onClick={() => { hideOrShowAudio() }} />:<AiOutlineAudioMuted color='black' size={iconSize}  onClick={() => { hideOrShowAudio() }} />}
            {screenShare?<MdScreenShare className=' cursor-pointer sm:block hidden' color='black' onClick={()=>{
  
                setscreenShare(false)
             videoReference.current.srcObject.getTracks()[1].stop()
             initialiseCam()
             
            }}/>:<MdStopScreenShare className=' cursor-pointer sm:block hidden' color='black'  onClick={()=>{
              
                 startCapture({video:true,audio:true})
                 
                
                }}/> }
            <Link href='/HomePage'>
             <div onClick={()=>{
                videoReference.current.srcObject.getTracks()[1].stop()
                videoReference.current.srcObject.getTracks()[0].stop()

             }}>
            <MdCallEnd color='white'  className='flex cursor-pointer bg-red-600 rounded-full w-8 h-8 justify-center items-center p-1'/>
            </div>
            </Link>
        </div>
        </div>

    )
}
