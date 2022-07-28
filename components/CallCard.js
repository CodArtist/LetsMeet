import React from 'react'

export default function CallCard({acceptRequest,c,declineRequest}) {
    return (
        <div className=' flex flex-col space-y-2 p-8 sm:p-8 items-center w-full bg-white rounded-lg shadow-lg z-20'>
            <div>{`${c.username} wants to Join`}</div>
            <div className=' flex flex-row space-x-3 sm:space-x-14'>
                <div className='flex justify-center items-center p-3 bg-red-500 text-white rounded-2xl shadow-lg cursor-pointer'  onClick={() => { declineRequest(c) }}>Decline</div>
                <div className='flex justify-center items-center p-3 bg-purple-600 text-white rounded-2xl shadow-lg cursor-pointer' onClick={() => { acceptRequest(c) }}>Accept</div>

            </div>
        </div>
    )
}
