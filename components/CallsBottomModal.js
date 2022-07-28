import * as React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { FiCopy } from 'react-icons/fi'
import {BiPhoneCall} from 'react-icons/bi'
import CallCard from './CallCard';
import { v4 as uuid } from 'uuid';



const drawerBleeding = 56;




const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

function CallsBottomModal({calls,acceptRequest,anyCalls,declineRequest}) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <div className=' absolute'>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />

    <div className='flex flex-col bg-white p-3 z-20 rounded-full shadow-lg absolute top-28 left-8 cursor-pointer'
                onClick={toggleDrawer(true)}>

{anyCalls?<div className=' absolute rounded-full w-4 h-4 bg-red-600 top-0 left-0'/>:<></>}
            <BiPhoneCall className={' top-0 left-0'} color='black'/>
            </div>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={true}
        ModalProps={{
          keepMounted: false,
        }}
      >
      
        <Puller />

        {calls.length===0?<div className=' flex justify-center items-center w-full h-full text-gray-400'>
         No Calls Yet
        </div>:<div className=' flex flex-col space-y-3 w-full h-full p-8 overflow-y-scroll'>
          {calls.map((c) => {
            if (!c.accepted)
              return (
                <CallCard key={uuid} acceptRequest={acceptRequest} c={c} declineRequest={declineRequest}/>
                
              )
         
          })}
        </div>
}      
   
      </SwipeableDrawer>
    </div>
  );
}



export default CallsBottomModal;
