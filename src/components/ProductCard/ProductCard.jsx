import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GiCheckMark } from "react-icons/gi";
import "./ProductCard.scss";
import { FaOpencart } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import QuickView from "../../components/QuickView/QuickView.jsx"
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi.js';
import useFetch from '../../customHooks/useFetch.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService.js';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../../Redux/CartSlice/CartSlice.js';


const ProductCard = ({data,open,setOpen,count,decrementQuantity,incrementQuantity}) => {
  // console.log(data)
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const [addItemToCart] = useAddItemToCartMutation();
  // const [hoverCartIcon,setHoverCartIcon] = useState(false);
  // const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity,setQuantity] = useState(1);
  const decrementNumber = ()=>{
    if(quantity>1){setQuantity(quantity-1)}
  }
  const incrementNumber = ()=>{setQuantity(quantity+1)}
  const d = encodeURIComponent(data.name.replace(/\//g, '~'));
  // const d = data?.name
  // const product_name = d.replace(/\s+/g,"-");

  // const handleAddToCart = (data)=>{
  //   dispatch(addToCart(data))
  // }
  const {access_token} = getToken();
  const handleAddToCart = async () => {
    try {
      if (access_token) {
        const response = await addItemToCart({ products_id: data.id, quantity: quantity });
        if (response.data) {
          // console.log(response.data);
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


  // const quickData = useFetch(`api/QuickView/${data.id}`);
  // console.log(quickData);



  return (
    <div className='w-full 300px:h-[320px] 768px:h-[320px] 1350px:h-[320px] 1280px:h-[320px]
     bg-black rounded-sm card-container
    shadow-sm  768px:p-1 1024px:p-[1px] 1280px:p-[2px]  p-[5px] relative cursor-pointer'>
      <div className="flex justify-end">
        </div>
        <div className='imgContainer'>
          <Link to={`/product/${d}`}>
            <img src={ data.product_imgs[0].images} alt="" className='img  w-[160px] 
              h-[160px] 1024px:w-[170px] 1024px:h-[170px] 
              1280px:w-[160px] 1280px:h-[160px] 1024px:mt-[2px] 1280px:mt-[1px] 1350px:mt-[2px] 
              mx-auto object-cover'/>
          </Link>
            <span className='quickView'
            onClick={() => handleQuickView(data.id)}><IoIosSearch size={16} title='Quick View'
            /></span>
                {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct}/>
                ) : null}
        </div> 
        <Link to={`/product/${d}`}>
          <h4 className='pb-[5px] font-[400] text-white 768px:pt-2 pt-[5px] 
          768px:ml-[2px] 1024px:ml-[7px] 1350px:ml-[5px] ml-[5px] text-[10px]'>
            {data?.name?.length>60 ? data?.name?.slice(0,60) + "..." : data.name}
          </h4>
        </Link>
        <div className='flex items-center 768px:ml-[14px] 1024px:ml-[5px]  justify-center 
         flex-col 1350px:flex-col'>
        {/* <div className="stock text-white flex items-center 768px:gap-[2px] 300px:mr-[10px]">
            <span className='text-[10px]'>(</span><GiCheckMark className='text-[#007bc4] text-[10px] ml-[3px] 768px:ml-0'/>
            <span className='capitalize text-[10px]
             mr-[2px] 768px:mr-0'>{data.stock}</span><span className='text-[10px]'>)</span>
          </div> */}
          <div className="price text-white  768px:mr-[12px] 1024px:mr-[5px] 1500px:mr-[12px] mr-[2px]">
            <span className="lineThroughPrice line-through  
            text-[13px] 768px:mr-[6px] mr-[3px]">{data.price}
            <strong className='text-[13px] font-[400] font-Roboto'>৳</strong></span>
            <span className='text-[#007bc4] font-[400]
            text-[13px]'>{data.discount_price}<strong 
            className=' text-[13px] font-[400] font-Roboto'>৳</strong></span>
          </div>
        </div>

        <div className="quantity mx-auto">
          <span className='minus ' onClick={decrementNumber}>-</span>
          <span className='text-[13px]'>{quantity}</span>
          <span className='plus' onClick={incrementNumber}>+</span>
        </div>
        <div className="btn ">
          <div className="add-to-cart" onClick={handleAddToCart}>add to cart</div>
          {/* <div className="cart-icon"><FaOpencart/></div> */}
        </div>
    </div>
  )
}

export default ProductCard
