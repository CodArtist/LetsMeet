import React from 'react'
import {AiFillGithub,AiFillLinkedin,AiFillFacebook} from 'react-icons/ai'

export default function Footer() {
  return (
    <div className=' flex flex-col items-center bg-white text-black text-sm w-full p-5'>
        @ Developed by Harsh Jain |
    <div className=' flex flex-row space-x-20 w-5/6 h-38 mt-5 text-black bg-white justify-evenly'>
        <a href='https://github.com/CodArtist' ><AiFillGithub/></a>
        <a href='https://www.facebook.com/people/Harsh-Jain/100005250007742' ><AiFillFacebook/></a>
        <a href='https://www.linkedin.com/in/harsh-jain2001/' ><AiFillLinkedin/></a>
        
        </div>
        </div>
        
  )
}
