import React, { useState } from 'react'

import { BiExpand } from 'react-icons/bi'


export default function Video({ identity, reference, name, socketId, muted, flipped, screenShare }) {
  const [expanded, setexpanded] = useState(false)




  return (
    <div className={`${expanded ? 'absolute w-screen h-screen top-0 left-0 bg-white z-20' : 'relative h-full w-full '}`}>


      < div className={`absolute z-10 left-5 bottom-5 ${expanded ? 'text-black' : 'text-white'} text-xl`}>{name}</div>
      <BiExpand className='absolute z-10 right-2 top-5 cursor-pointer' color={`${expanded ? 'black' : 'white'}`}
        onClick={() => { setexpanded(!expanded) }} />
      <video

        className={`h-full w-full ${expanded ? 'object-contain' : 'object-cover'} ${flipped != null && !screenShare ? '-scale-x-100' : ''} rounded-xl`}
        ref={reference}
        autoPlay={true}
        muted={muted != null ? muted : false}

      />

    </div>
  )
}
