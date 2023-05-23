import React, { useState, useEffect, useRef } from 'react';

import Generate from '../components/Generare'
import Screenshot from '../resources/Screenshot.png'
import Screenshot_ShareToWeb from '../resources/Screenshot_ShareToWeb.png'
import Screenshot_AboutName from '../resources/Screenshot_AboutName.png'

import { Modal } from 'antd';
import { Button } from '../components/Button'

import "tailwindcss/tailwind.css"
import '../home.css'

export default function Home() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return <div className='flex w-screen relative top-0 bottom-0 left-0 right-0 min-h-screen'>
        <div className=' generate h-auto flex flex-grouw text-gray-400 text-base flex-col justify-start'>
            <main className='p-8 h-full flex-grouw md:m-auto md:py-16 md:pl-16  flex items-center flex-col md:flex-row'>
                <div className='left flex flex-col mb-14'>
                    <div className=''>
                        <header className='mb-10'>
                            <div className='mb-4 '>
                                <h1 className='text-4xl md:text-5xl text-white mb-3  mr-3 w-full inline'>Generate your website</h1>

                                <span class=" align-super mt-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">No-code</span>

                            </div>

                            <span>based on your <a className='underline' href="https://heptabase.com/">Heptabase</a> data</span>
                        </header>

                        <div class="mt-4 flex items-center gap-x-6">

                            <Button onClick={showModal}>Get started</Button>
                            <a href="https://share.dabing.one/post?whiteboard_id=12e511518f5539c9ee5bc3c02fecab6d4f78a37eb8e13a2cfec484026b0d3c55" target='_blank' class="text-sm font-semibold leading-6 text-gray-100">View live example <span aria-hidden="true">→</span></a>

                        </div>


                    </div>


                </div>

                <div className='right grow md:relative  md:flex md:w-3/5 md:pt-20 md:pl-20 items-center'
                    style={{
                        // background: 'radial-gradient(50% 50% at 50% 50%, #0F0C29 27.6%, rgba(48, 43, 99, 0) 100%)'
                    }}>
                    <div className=' md:block relative my-auto	'
                        style={{
                            right: '0px'
                        }}
                    >
                        <img className=' md:block ' src={Screenshot} />
                        {/* <button className='w-32 h-8 text-sm absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
        rounded   text-blue-400 border border-blue-400 hover:opacity-70 active:opacity-60
        '>View Example</button> */}
                    </div>
                </div>

            </main >

            <footer className='text-sm sticky bottom-2 text-gray-500 flex flex-col md:flex-row items-center md:px-16'>

                {/* <a href="https://github.com/draJiang/Heptabase-Blog/tree/public">🚀View in Github</a> */}
                <a href="https://www.buymeacoffee.com/jiangzilong">☕Buy me a coffee</a>

            </footer>

            <Modal title="Generate your site"
                bodyStyle={{ maxHeight: '80%', overflow: 'scroll' }}
                footer={null} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <div className='p-2 text-gray-800'>
                    <div className='mb-4'>
                        <p>
                            1. Select/create one whiteboard in Hepta and share it to the web.
                        </p>

                        <img className='max-w-md px-4 pt-4 mb-0' src={Screenshot_ShareToWeb} />
                    </div>
                    <div className='mb-4'>
                        <p>
                            2. Create a card in the above whiteboard and set the title to “About”.
                        </p>
                    </div>
                    <div className='mb-4'>
                        <p>3. Generate your link.</p>

                        <Generate />

                    </div>
                </div>

            </Modal>

        </div >
    </div>
}
