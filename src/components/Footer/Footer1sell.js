import React from 'react'
import veges from '../../assets/images/farm2.jpg'
import './Footer1.css'
const Footer1 = () => {
    return (
        <div className='footer1'>
            <div className='left'>
                <img src={veges} alt='veges' />
            </div>
            <div className='right'>
                <h1>Fresh Vegetables , Fruits , Dry Fruits and Grocery Pickup at your Doorstep
                </h1>
                <p>We Need Only  Organic Products
                   
                </p>
            </div>
        </div>
    )
}

export default Footer1