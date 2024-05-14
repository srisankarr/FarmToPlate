import React from 'react'
import slidebanner1 from './images/slidebanner1.jpg'
import slidebanner2 from './images/slidebanner2.jpg'
import './BannerSlider.css'
import Slider from 'react-slick'
const BannerSlider=()=> {
        const data=[
            {
                id:1,
                image:slidebanner2,
                title:'Fresh Vegetables , Fruits ,Dry Fruits and Grocery',
                description:'Deliver items at Doorstep',
              
            },
            {
              id:2,
              image:slidebanner1,
              title:'Fresh Vegetables , Fruits ,Dry Fruits and Grocery',
              description:'Deliver items at Doorstep',
         
            }

        ]


        var settings={
          dots:true,
          infinite:true,
          speed:500,
          slideToshow:1,
          slideToScroll:1
        };


  return (
    <div className='bannerslider'>
        <Slider className='bannerslider' {...settings}>
        {
          data.map(item => {
              return(
                   <div className='imagecont' key={item.id}> 
                   
                   <img src={item.image} alt='vegetables' />
                   <div className='content'>
                        <h1>{item.title}</h1>
                        <span>{item.description}</span>
                      
                   </div>

                   </div>

              )

          })
        }
        </Slider>



    </div>
  )
}

export default BannerSlider