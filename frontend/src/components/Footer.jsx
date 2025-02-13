import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {

  const navigate = useNavigate()

//   useEffect(() => {
//     window.scrollTo(0, 0) // Scroll to top on component load
// }, [])

  return (
    <div className='md:mx-10'>
      <div className='flex flex-cl sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* ----- Left Section ---- */}
        <div>
            <img className='mb-5 w-40' src={assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and type-setting industry. lorem Ipsum has been the industry's standard dummy text eber since the 1500s, when an unknown printer took a gallery of type and scambled it to make a type specimen book.</p>
        </div>

          {/* ----- Center Section ---- */}

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600 cursor-pointer'> 
            <li  onClick={() =>{ navigate(`/`); scrollTo(0,0)}}>Home</li>
            <li  onClick={() =>{ navigate(`/about`); scrollTo(0,0)}}>About us</li>
            <li  onClick={() =>{ navigate(`/contact`); scrollTo(0,0)}}>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
              {/* ----- Right Section ---- */}
        <div>
           <p className='text-xl font-medium mb-5'>GET IN TOUCH</p> 
           <ul className='flex flex-col gap-2 text-gray-600'> 
            <li>+1 -212-456-7890</li>
            <li>prescripto@gmail.com</li>
           </ul>
        </div>
      </div>
        {/* ------------ Copyright Text -------- */}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ Prescripto-All Right Reserved</p>
      </div>
    </div>
  )
}

export default Footer
