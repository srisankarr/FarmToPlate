import React,{ useCallback, useEffect,  useState } from "react";
import {  Link ,useNavigate} from 'react-router-dom';
import logo from "../../assets/images/formtoplate.png"
import { useAuthh } from "../../providersell/AuthProvidersell";


import "./navbar.css"



function Navbar({ setIsLoginOpen ,cartCount,fetchCartCount}){
   
    
    const { isLoggedIn, logout} = useAuthh();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate =useNavigate ();
   
    const handleLogout = async () => {
        try {
            // Call backend API to logout
            const response= await logout();
                await fetchCartCount();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
       
    };
      const handleDropdownItemClick = () => {
    setDropdownVisible(false); // Close the dropdown when an item is clicked
  };

if(isLoggedIn)
{
    fetchCartCount();
}else
{ 
cartCount=0;
}
   

      
    return(
        <div>
            <nav className="nav">
            <div className="logoo">
            <img src={logo} alt='logo' className='logo' />
            </div>
                <ul className="nav_menu">
                    <li className="nav_item" onClick={() =>  navigate ('/seller')}>HOME</li>
                     <li className="nav_item"onClick={() =>  navigate ('seller/aboutPage')}> ABOUT</li>
                     <li className="nav_item"onClick={() =>  navigate ('seller/contact')}> CONTACT US</li>
                </ul>
             <div className="right">
                <div className="cart">
                                <Link to="seller/addtocart">
                              <span className="qty">{cartCount}</span>
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                             </Link>
                      </div>
                <div className="profile-icon">
                   <button className="profile-icon-btn" onClick={toggleDropdown}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> 
                    </button>
                   {dropdownVisible && (
                        <div className="profile-dropdown">
                    {isLoggedIn ? (
                        <>
                            <Link to="seller/profile" onClick={() =>{setIsLoginOpen(true);  handleDropdownItemClick(); }  }>Profile</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                        <Link to="seller/logins" onClick={() => {setIsLoginOpen(true);     handleDropdownItemClick();}}>Login</Link>
                         <Link to="seller/signup" onClick={() => { setIsLoginOpen(true);     handleDropdownItemClick();}}  >Sign Up</Link>
                        </>
                    )}
                </div>
                    )}

                </div>
              </div>
            
            </nav>

            
      </div>
      
       
    );
}


export default Navbar;