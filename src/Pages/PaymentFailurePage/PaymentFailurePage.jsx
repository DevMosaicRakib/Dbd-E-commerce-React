import React from 'react'
import './PaymentFailurePage.scss';
import { RxCross1 } from "react-icons/rx";
const PaymentFailurePage = () => {
  return (
    <div className='w-[98%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto h-full 768px:h-[100vh] 1280px:h-full'>
      <div className="payment-failure-container h-[200px] 300px:my-[100px] 768px:mt-[100px]">
      <div className="icon-failure">
        <div className="circle">
        <div className="cross">
          <RxCross1 className='line1 font-[900] font-Roboto text-[20px] text-[#d9534f]'/>
        </div>
        </div>

      </div>
      <h2 className='h2 font-[22px]'><span className='text-[#d9534f]'>Oops !</span> Payment Failed</h2>
      <p className='p font-[14px]'>Please try again.</p>
    </div>
    </div>
  )
}

export default PaymentFailurePage
