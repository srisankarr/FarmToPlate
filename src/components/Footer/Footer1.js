import React from 'react'
import veges from '../../assets/images/foot1.jpg'
import './Footer1.css'
const Footer1 = () => {
    return (
        <div className='footer1'>
            <div className='left'>
                <img src={veges} alt='veges' />
            </div>
            <div className='right'>
                <h1>We deliver Fresh Vegetables , Fruits ,Dry Fruits and Grocery at your Doorstep
                </h1>
              
            </div>
        </div>
    )
}

export default Footer1