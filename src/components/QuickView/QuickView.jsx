import React, { useEffect, useRef, useState } from 'react'
import {RxCross1} from "react-icons/rx";
import styles from "../../Styles/Styles"
import {AiOutlineShoppingCart} from "react-icons/ai"
import { GiBuyCard } from "react-icons/gi";
import "./QuickView.scss";
import { useAddItemToCartMutation, useFetchCartItemsQuery } from '../../Redux/CartSlice/cartApi';
import { toast } from 'react-toastify';
import { getToken } from '../../Redux/UserAndAuthServices/LocalStorageService';
import { useNavigate } from 'react-router-dom';


// import {productData} from "../../Static/Data"
const QuickView = ({data,setOpen,open,setSelectedProduct}) => {
    // const [click ,setClick]= useState(false);
    // const [select,setSelect] = useState(false);
    // console.log(data)
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const quickViewRef = useRef(null);
    useEffect(() => {
      // Function to close the shopSideBar if clicked outside
      const handleClickOutside = (event) => {
        if (quickViewRef.current && !quickViewRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
  
      // Add event listener to detect clicks outside
      document.addEventListener("mousedown", handleClickOutside);
  
      // Cleanup event listener on component unmount
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [quickViewRef, setOpen]);

    useEffect(() => {
      const scrollContainer = scrollRef.current;

      // Custom scroll handler for horizontal scrolling
      const onWheel = (e) => {
          if (e.deltaY !== 0) {
              scrollContainer.scrollLeft += e.deltaY; // Adjust for horizontal scrolling
              e.preventDefault(); // Prevent default vertical scroll
          }
      };

      // Attach the event listener
      scrollContainer.addEventListener('wheel', onWheel);

      // Cleanup the event listener on component unmount
      return () => scrollContainer.removeEventListener('wheel', onWheel);
    }, []);
    const {access_token} = getToken();
    const [selectedImg,setSelectedImg] = useState(process.env.REACT_APP_IMG_URL + (data?.product_imgs?.[0]?.images || ''));
    const [count, setCount] = useState(1);

    const decrementQuantity = () => {
      if (count > 1) {
        setCount(count - 1);
      }
    };
    const incrementQuantity = () => {
      setCount(count + 1);
    };
    const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
    const [addItemToCart] = useAddItemToCartMutation();

    if (!open) return null;

    const handleBuyNow = async () =>{
      try {
        if (access_token) {
          const response = await addItemToCart({ products_id: data.id, quantity: count });
          if (response.data) {
            refetch();
            navigate('/checkout');
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
    
    const handleAddToCart = async () => {
      try {
        if (access_token) {
          const response = await addItemToCart({ products_id: data.id, quantity: count });
          if (response.data) {
            const productName = response.data.data.products?.name;
      
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

    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(data?.description || "", 'text/html');
    const plainTextDescription = parsedHtml.body.textContent || "";

  return (
    <div className='bg-[#fff]'>
      {data?(
        <div className="fixed w-full h-screen top-0 left-0 
        bg-[#0000008f] z-50 flex items-center
        justify-center">
            <div ref={quickViewRef} className="relative w-[90%] 768px:w-[60%] 
            h-[90vh] overflow-y-scroll no-scrollbar 768px:h-[75vh] 
            bg-white rounded-md shadow-md p-4">
                <RxCross1 size={20} className="absolute right-3 top-3 z-50" 
                onClick={()=>setOpen(false)}/>

                <div className=" w-full 768px:flex justify-center items-center mt-[30px]">
                     {/* <div className='w-full 768px:w-[55%] '>
                        <div className='w-full h-[75%] mb-2 overflow-hidden relative'>
                        <img src={selectedImg} className='w-[300px] h-[300px]  
                              object-contain ' alt=""/>
                            </div>
                        <div className="w-[300px]">
                          <div className="w-full overflow-x-scroll scroll-smooth no-scrollbar flex items-center gap-[5px]">
                            {data?.product_imgs?.map((image,i)=>(
                                <img src={process.env.REACT_APP_IMG_URL+image.images} alt="" key={i} 
                                onClick={()=>setSelectedImg(process.env.REACT_APP_IMG_URL+image.images)} className='
                                w-[55px] h-[55px] object-cover cursor-pointer border-[1px] border-[rgba(0,0,0,0.2)]'/>
                            ))}
                          </div>
                        </div>
                    </div>  */}


                      <div className='w-full 768px:w-[50%]'>
                            <div className='w-[295px] h-[295px] mb-2 overflow-hidden relative'>
                                <img src={selectedImg} className='w-full h-full object-cover overflow-hidden' alt=""/>
                            </div>
                            
                            <div style={{ width: '300px', overflowX: 'scroll' }} ref={scrollRef} className='no-scrollbar'>
                                <div style={{ display: 'flex', gap: '5px', width: 'max-content' }}>
                                    {data?.product_imgs?.map((image, i) => (
                                        <img
                                            key={i}
                                            src={process.env.REACT_APP_IMG_URL + image.images}
                                            alt=""
                                            onClick={() => setSelectedImg(process.env.REACT_APP_IMG_URL + image.images)}
                                            style={{ width: '55px', height: '55px', cursor: 'pointer', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.2)' }}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>




                    <div className='w-full 768px:w-[42%]  pl-[5px] pr-[5px] '>
                        <h2 className={`text-[#242424] capitalize mb-2 text-[16px] font-[400]`}>{data?.name}</h2>
                        <p className='font-[400] text-[gray] mt-[5px] text-[12px]'>{plainTextDescription?.length>100 ? plainTextDescription?.slice(0,100) + "..." : plainTextDescription}</p>
                        <div className='flex pt-3 mb-2'>
                            <h4 className={`font-normal text-[13px]`}> <span className='font-Roboto text-[13px]'>৳</span>  {data?.discount_price}</h4>
                            <h4 className={`line-through font-[400] text-[16px] ml-3 1350px:text-[13px]`}>
                            <strong className='text-[13px] font-[400] font-Roboto'>৳</strong> {data?.price? data.price:null}</h4>
                        </div>
                        <div className="flex items-center pt-4">
                            <button className='py-[2px]
                             px-2 text-center text-white bg-[#077bc4] text-[13px]'
                             onClick={decrementQuantity}>-</button>
                            <span className='py-1 px-5 text-center font-normal text-[13px]'>{count}</span>
                            <button className='py-[2px]
                             px-2 text-center text-white bg-[#077bc4] text-[13px]'
                             onClick={incrementQuantity}>+</button>
                        </div>
                        <div className="flex items-center mt-4 gap-[30px]">
                           <div className={`h-[35px] w-[100px] my-1 flex justify-center 
                           items-center bg-[#077bc4] addCart rounded-sm cursor-pointer`}
                           onClick={handleAddToCart}>
                            <span className='text-white font-[400] flex items-center justify-center text-[13px]'>
                                Add to cart <AiOutlineShoppingCart className='ml-2 text-[13px]'/></span>
                           </div>
                           <div className={`h-[35px] w-[100px] my-1 flex justify-center cursor-pointer 
                            items-center bg-[orangered] buy rounded-sm`}
                            onClick={handleBuyNow}>
                            <span className='text-[#fff] font-[400] flex items-center justify-center text-[13px]'>
                                Buy now <GiBuyCard className='ml-2 text-[13px]'/></span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      ):null}
    </div>
  )
}

export default QuickView
