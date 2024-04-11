import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer'
import CalendarHeatmap from '../components/CalendarHeatmap'


function Activity(props) {

    return<div className='notes_box'>
        <Nav />
        <div>
            <CalendarHeatmap />
        </div>

    </div>
}

export default Activity;