import React, { useEffect, useState } from 'react'
import { FaOpencart } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom'
import { GiCheckMark } from "react-icons/gi";
import "./ShopProduct.scss"
import QuickView from '../QuickView/QuickView';
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';

const ShopProduct = ({data,open,setOpen}) => {
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const [addItemToCart] = useAddItemToCartMutation();
  const d = encodeURIComponent(data.name.replace(/\//g, '~'));
  const [selectedProduct,setSelectedProduct] = useState(null);
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
    <div className='w-full 300px:h-[300px] 768px:h-[300px] 1280px:h-[284px] 1350px:h-[300px] bg-white rounded-sm card-container4
    shadow-xl 768px:p-3 1280px:p-[2px]  p-[2px] relative cursor-pointer'>
      <div className="flex justify-end">
        </div>
       
            <div className='imgContainer4 bg-black overflow-hidden'>
            <Link to={`/product/${d}`}>
            <img src={process.env.REACT_APP_IMG_URL + data.product_imgs[0].images} alt="" className=' img
            mx-auto 768px:mt-0 1280px:mt-[2px]  mt-[2px] 768px:mb-0 1024px:mt-[5px] 1024px:mb-[5px]
            1280px:mb-[2px] 1350px:mt-0 1350px:mb-0  mb-[2px] w-[150px] h-[150px] 1280px:w-[142px] 1280px:h-[142px] 
            1350px:w-[150px] 1350px:h-[150px] object-cover'/>
             </Link>
             <span className='quickView4 hidden 1350px:block'><IoIosSearch size={16} title='Quick View'
            onClick={()=>{handleQuickView(data.id)}}/></span>
            {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct}/>
                ) : null}
            </div>
       

        <Link to={`/product/${d}`}>
          <h4 className='pb-3 font-[400] text-[#077bc4] pt-2 768px:ml-[10px] 1280px:ml-[2px] 1300px:ml-[10px]
           ml-[5px] text-[10px]'>
            {data.name.length>50 ? data.name.slice(0,50) + "..." : data.name}
          </h4>
        </Link>
        <div className='flex flex-col  items-center 768px:ml-0 1280px:ml-0 
         ml-0 gap-1 stockAndPrice 
         overflow-hidden w-full'>
        <div className="stock4 flex items-center
         justify-between gap-[1px] mr-[10px] 768px:mr-0">
            <span className='text-[8px]'>(</span><GiCheckMark className='text-[#007bc4] text-[8px] '/>
            <span className='capitalize font-[400] text-[8px] '>{data.stock}</span>
            <span className='text-[8px]'>)</span>
          </div>
          <div className="price4 text-black">
          <span className="lineThroughPrice line-through
             text-[13px] font-normal mr-[2px]">{data?.price}
            <strong className='text-[13px] font-[400] font-Roboto'>৳</strong></span>
            <span className='text-[#007bc4] font-[400]  text-[13px]'>{data?.discount_price}<strong 
            className='text-[13px] font-[400] font-Roboto'>৳</strong></span>
          </div>
        </div>

        <div className="btn4">
          <div className="add-to-cart4 font-[400]" onClick={handleAddToCart}>add to cart</div>
          {/* <div className="cart-icon4"><FaOpencart/></div> */}
        </div>
    </div>
  )
}

export default ShopProduct
