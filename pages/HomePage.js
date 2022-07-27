import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {RiVideoAddFill} from 'react-icons/ri'
import Footer from '../components/Footer'
export default function HomePage() {
    const router = useRouter()
    const [joinRoomName, setjoinRoomName] = useState('')
    const [myName, setmyName] = useState(' ')
    return (
        <div>
        <div className='relative flex flex-col sm:flex-row sm:h-screen w-full h-full  bg-purple-600 overflow-y-hidden '>
            <div className='z-10 top-0 left-0 flex flex-col items-start space-y-12  w-screen bg-white p-7 pb-36 rounded-br-[150px] rounded-bl-[100px] sm:rounded-none sm:w-1/2 '>

                <p className="w-40 h-8 text-2xl font-extrabold text-gray-600 mb-4" style={{ 'fontFamily': 'Poppins' }}>LetsMeet</p>
                <p className="text-sm text-black" style={{ 'fontFamily': 'Roboto' }}>A Web App made for video Conference meetings<br />To do a Conference, Just Create a meeting and share the link with your friends</p>

                <div className=' flex flex-col space-y-5 justify-start items-start'>
                <input type={'text'} className={' border-none outline-none bg-gray-200 p-2 text-black w-8/12'} placeholder={"Enter Name"} onChange={(e) => {
                        setmyName(e.target.value)
                    }} />
                    <div className="flex flex-row space-x-3 items-center justify-center h-12 p-5 bg-purple-600 shadow-lg rounded-full cursor-pointer" 
                    onClick={() => {
                         if(myName.trim().length===0)
                        alert("Please Provide your name to create a meeting")
                        else
                         router.push(`/AdminRoom?username=${myName}`) }}>
                        <p className="text-base font-bold text-white" style={{ 'fontFamily': 'Roboto' }}>Create Meeting</p>
                        <RiVideoAddFill color='white'/>
                    </div>
                </div>


                <div></div>
                <div className="flex flex-row space-x-3">

                    <input type={'text'} className={' border-none outline-none bg-gray-200 p-2 text-black w-5/6'} placeholder={"Enter a meeting id"} onChange={(e) => {
                        setjoinRoomName(e.target.value)
                    }} />
                    <div className="flex items-center justify-center w-20 h-12 p-5 bg-purple-600 shadow-lg rounded-full cursor-pointer" onClick={() => {
                        if(joinRoomName.trim().length===0)
                        alert("Please Provide a meeting Id to join a meeting")
                        else
                        router.push(`/Room/${joinRoomName}`)
                    }}>
                        <p className="text-base font-bold text-white">Join</p>
                    </div>
                </div>



            </div>
            <div className=' flex flex-row justify-between items-end sm:w-1/2 h-full'>
                <img className='  w-1/2 sm:w-2/5 z-0' src={"/Man.png"} />
                <img className='  w-1/2 sm:w-2/5 z-0' src={"/Women.png"} />
            </div>

           
            {/* <Footer /> */}

        </div>
                    <Footer />

        </div>

    )
}
