import React, { useEffect, useState } from 'react'
import Styles from "../../Styles/Styles"
// import { productData } from '../../Static/Data';
import ShopProduct from "../../components/ShopProduct/ShopProduct"
import CatProdCard from '../CatSecProCard/CatProdCard'
import useFetch from '../../customHooks/useFetch';
// import axios from 'axios';
const SuggestedProduct = ({data,open,setOpen}) => {
    const allprodctData = useFetch('api/products/')
    // console.log(allprodctData);
    // console.log(data);
  
      
      const [products, setProducts] = useState(null);
    
      
      useEffect(() => {
        if (allprodctData) {
          const filteredData = allprodctData?.filter((i) => i?.Category?.catname === data?.Category?.catname);
          setProducts(filteredData);
        }
      }, [allprodctData, data.Category]);
    
      // rest of the component
  
  return (
    <>
    {
        data ? (
            <div className={` p-1 1350px:py-[30px] 1350px:px-[58px]
            w-[98%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto bg-[rgb(234,234,234,0.3)] mb-[50px]`}>
                <h2 className={`text-[16px] font-[400] text-[orangered]
                   mt-[8px]`}>
                    Related Products
                </h2>
                <div className="w-[4%] h-[2px] bg-[rgb(7,123,196,0.6)] mb-[10px]"></div>
                <div className="productsPart grid grid-cols-2 gap-[6px]
        md:grid-cols-2 md:gap[15px] lg:grid-cols-4 xl:grid-cols-6 1350px:gap-[11px]
         300px:w-[98%] w-[86%] 1350px:w-[100%] mx-auto mb-[10px]">
           {products && products.map((i,index)=>(
              <ShopProduct data={i} key={index} open={open} setOpen={setOpen}/>
           ))}
           
        </div>
          </div>
        ) : null
    }
    </>
  )
}

export default SuggestedProduct
