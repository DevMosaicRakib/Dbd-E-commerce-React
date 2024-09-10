import React, { useEffect, useState } from 'react'
import { FaOpencart } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom'
import { GiCheckMark } from "react-icons/gi";
import "./HdProCard.scss";
import QuickView from '../QuickView/QuickView';
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';

const HdProductCard = ({data,open,setOpen}) => {
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const [selectedProduct,setSelectedProduct] = useState(null)
  const [addItemToCart] = useAddItemToCartMutation();
  const d = encodeURIComponent(data.name.replace(/\//g, '~'));
  const {access_token} = getToken()
  const handleAddToCart = async () => {
    try {
      if (access_token) {
        const response = await addItemToCart({ products_id: data.id, quantity: 1 });
        if (response.data) {
          const productName = response.data.data.products?.name;
          console.log('Product name:', productName);
      
          if (productName) {
            toast.success(`${productName.length>15?productName.slice(0,15)+' ':productName} added to cart successfully`);
          } else {
            console.error('Product name not found');
          }
          refetch()
        } else {
          console.error('Failed to add item to cart');
        }
      }
      else{
        toast.error('Login first... Please!!!')
      }

    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  const handleQuickView = async (productId) => {
    if (!productId) {
        console.error("Product ID is undefined");
        return;
    }
    console.log(productId)
    try {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}api/QuickView/${productId}`);
        console.log(result);
        setSelectedProduct(result.data);
        setOpen(true);
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    if (!open) {
        setSelectedProduct(null); // Reset selected product when modal is closed
    }
  }, [open]);
    // const product_name = d.replace(/\s+/g,"-");
  return (
    <div className='w-full 768px:h-[260px] 1280px:h-[260px] h-[420px]
    300px:h-[300px] bg-white rounded-sm card-container2
    shadow-sm  768px:p-[2px] 1024px:p-2 1280px:p-[2px]  p-[5px] relative cursor-pointer'>
      <div className="flex justify-end">
        </div>
        
            <div className='imgContainer2 bg-black overflow-hidden '>
            <Link to={`/product/${d}`}>
            <img src={data.product_imgs[0].images} alt="" className='img w-[130px] h-[130px] 
            300px:w-[155px] 300px:h-[155px] 768px:w-[130px] 768px:h-[130px]
            mx-auto  object-cover'/>
            </Link>
            <span className='quickView2'><IoIosSearch size={16} title='Quick View'
            onClick={()=>{handleQuickView(data.id)}}/></span>
             {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct}/>
                ) : null}
            </div>
      
    
        <Link to={`/product/${d}`}>
          <h4 className='pb-2 font-[400] text-[#077bc4] pt-1 768px:ml-[5px] ml-[2px] text-[10px]'>
            {data.name.length>50 ? data.name.slice(0,50) + "..." : data.name}
          </h4>
        </Link>
        <div className='flex flex-col items-center ml-[2px] gap-1 mr-1 justify-between overflow-hidden w-full'>
        <div className="stock2 text-[gray] flex items-center
         justify-between gap-[1px] 768px:mr-[15px] 300px:mr-0 mr-[10px]">
            <span className='text-[8px]'>(</span><GiCheckMark className='text-[rgb(0,123,196)] text-[8px]'/>
            <span className='capitalize font-[400] text-[8px]'>{data.stock}</span><span className='text-[8px]'>)</span>
          </div>
          <div className="price2 text-[gray]  mr-[2px]">
          <span className="lineThroughPrice line-through text-[13px] font-[400] mr-[3px]">{data.price}
            <strong className='
             text-[13px] font-[400] font-Roboto'>৳</strong></span>

            <span className='text-[#007bc4] font-[400] 
              text-[13px]'>{data.discount_price}<strong 
            className=' text-[13px] font-[400] font-Roboto'>৳</strong></span>

          </div>
        </div>

        <div className="btn2 ">
          <div className="add-to-cart2 " onClick={handleAddToCart}>add to cart</div>
          {/* <div className="cart-icon2"><FaOpencart/></div> */}
        </div>
    </div>
  )
}

export default HdProductCard
