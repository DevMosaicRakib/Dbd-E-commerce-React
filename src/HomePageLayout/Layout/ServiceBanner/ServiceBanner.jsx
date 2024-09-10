import React from 'react'
import Style from "../../../Styles/Styles";
import ban from "../../../Assets/img/bannerImg/dv.png";
import "./ServiceBanner.scss";
const ServiceBanner = () => {
  return (
    <div className={`1350px:w-[81.5%] 1350px:mx-auto 1024px:w-[98%] 1280px:w-[83%] w-[97%] mx-auto 1280px:mx-auto  bannerContainer3`}>
    <div className="imgContainer3">
    <img src={ban} alt="" />
    </div>
  </div>
  )
}

export default ServiceBanner
