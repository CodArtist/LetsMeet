import React, { useState } from 'react'
import { FiCameraOff, FiCamera} from 'react-icons/fi'
import { AiOutlineAudioMuted,AiFillAudio } from 'react-icons/ai'
import {BsCameraVideoFill,BsCameraVideoOff} from 'react-icons/bs'

export default function WaitingRoomControl({ videoReference, setvideoRefernce,showCam,showAudio,setshowAudio,setshowCam }) {

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
    return (
        <div className="flex flex-row space-x-8 p-3 w-screen h-16 bottom-0 justify-center items-center">
            {showCam?<BsCameraVideoFill color='black' size={iconSize} onClick={() => {hideOrShowCam()}} />:<BsCameraVideoOff color='black' size={iconSize}  onClick={() => {hideOrShowCam()}} />}
            {showAudio?<AiFillAudio color='black' size={iconSize} onClick={() => { hideOrShowAudio() }} />:<AiOutlineAudioMuted color='black' size={iconSize}  onClick={() => { hideOrShowAudio() }} />}
        </div>

    )
}
