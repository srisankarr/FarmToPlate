import React from 'react'
import slidebanner1 from './images/farm1.jpg'
import slidebanner2 from './images/slidebanner2.jpg'
import './BannerSlider.css'
import Slider from 'react-slick'
const BannerSlider=()=> {
        const data=[
            {
                id:1,
                image:slidebanner1,
                title:'Fresh Vegetables , Fruits , Dry Fruits and Grocery',
                description:'Pickup your items at Doorstep',
                button:'www.google.com'
            },
            {
              id:2,
              image:slidebanner2,
              title:'Fresh Vegetables And Fruits',
              description:'Pickup items at Doorstep',
              button:'www.google.com'
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