import React, { useState, useEffect, useRef } from 'react';
import WidgetBot, { API } from '@widgetbot/react-embed'
import Nav from '../components/Nav';

export default function Chat(props) {

    return (
        <div className='notes_box'>
            <Nav />
            <div className='flex flex-col items-center md:px-8'>
                <div className='py-8'>
                    欢迎交流
                </div>
                <WidgetBot
                    server="1225918486233219122"
                    channel="1225918486795128926"
                    style={{
                        height: '80vh',
                        width: '80%',
                        marginTop: '20px'
                    }}
                />
            </div>
        </div>
    )

}