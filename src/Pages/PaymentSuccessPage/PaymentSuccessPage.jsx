// import axios from 'axios'
import React from 'react'
// import Lottie from "react-lottie";
// import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService'
import './PaymentSuccessPage.scss'
import { useNavigate } from 'react-router-dom'

const PaymentSuccessPage = () => {

  const navigate = useNavigate();
  return (
    <div className='w-[98%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto h-[100vh]'>
      <div className="success-container 1280px:shadow-sm 1280px:shadow-[rgb(128,128,128,0.4)] mt-[10px]
      w-full h-full 1280px:w-[40%] 1280px:h-[70%] mx-auto">
        <div className="checkmark-circle ">
          <div className="checkmark"></div>
        </div>
        <h2 className='successh2 1280px:text-[22px] text-[16px] font-normal'>Thank You!</h2>
        <p className='successp text-[14px] text-[#242424] font-normal mt-[10px]'>Payment done Successfully</p>
        <p className='successp text-[13px] text-[gray] font-normal mt-[20px]'>You will be redirected to the home page shortly <br/> or click here to return to home page</p>
        <button className='button text-[13px] text-[#fff] bg-[#4caf50] border-none
        outline-none py-1 px-2 w-[90px] h-[35px] mt-[10px]'
        onClick={()=>navigate('/')}>Home</button>
      </div>
      
    </div>
  )
}

export default PaymentSuccessPage
