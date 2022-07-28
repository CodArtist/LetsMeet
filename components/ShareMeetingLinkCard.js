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
import { AiOutlineLink } from 'react-icons/ai'


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





function ShareMeetingLinkCard({ MeetingLink }) {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };



    return (
        <div className=' absolute '>
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: `calc(50% - ${drawerBleeding}px)`,
                        overflow: 'visible',
                    },
                }}
            />
            <div className='flex flex-col z-20 bg-white p-3 rounded-full shadow-lg absolute top-6 left-8 cursor-pointer'
                onClick={toggleDrawer(true)}>

                <AiOutlineLink color='black' />
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
             <Puller/>

                <div className=' flex flex-col p-7 h-full items-center justify-center'

                >
                    <div className=' flex flex-col space-y-3 sm:w-auto w-5/6'>

                        <div className=' text-sm text-gray-500'>Share this Link</div>
                        <div className=' flex flex-row items-center space-x-5 sm:w-full'>
                            <div className=' flex sm:w-full p-2 bg-gray-300 w-5/6 rounded-lg overflow-auto '>
                                {MeetingLink}
                                </div>
                            <FiCopy className=' cursor-pointer' color='black' onClick={() => {
                                navigator.clipboard.writeText(MeetingLink)
                            }} />
                        </div>
                    </div>
                </div>
            </SwipeableDrawer>
        </div>
    );
}



export default ShareMeetingLinkCard;
