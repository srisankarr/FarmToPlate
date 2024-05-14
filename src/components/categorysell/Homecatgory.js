import React, { useState } from 'react'
import './Homecategory.css'
import img1 from '../../assets/images/vegetables.jpg'
import img2 from '../../assets/images/fruitspic.jpg'
import img3 from '../../assets/images/dryfruitspic.jpg'
import img4 from '../../assets/images/grainspic.jpg'

const Homecategories = ({onCategorySelected}) => {

 
  const handleClick = (category) => {
 onCategorySelected(category);
    console.log(`Clicked on ${category}`);
  };



  return (
    <div className='homecategories' >
      <div className='container'  onClick={() => handleClick('Vegetables')}>
        <img src={img1} alt='img1' />
        <div className='content'>
          <h1>
           VEGETABLES
          </h1>
        
        </div>
      </div>
      <div className='container' onClick={() => handleClick('fruits')}>
        <img src={img2} alt='img2' />
        <div className='content'>
          <h1>
        FRUITS
          </h1>
      
        </div>
      </div>
      <div className='container'  onClick={() => handleClick('dryfruits')}>
        <img src={img3} alt='img3' />
        <div className='content'>
          <h1>
       DRY FRUITS
          </h1>
      
        </div>
      </div>
      <div className='container' onClick={() => handleClick('grocery')}>
        <img src={img4} alt='img4' />
         <div className='content'>
          <h1>
       GRAINS
          </h1>
        
        </div>
      </div>
    </div>
  )
}

export default Homecategories