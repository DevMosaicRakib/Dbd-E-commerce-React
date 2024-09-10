import { Link } from "react-router-dom";
import Styles from "../../Styles/Styles"
import { useEffect, useState } from "react";
import { GiCheckMark } from "react-icons/gi";
import { FaOpencart } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import "./ShopMenu.scss";
import QuickView from "../QuickView/QuickView";
import axios from "axios";
import { toast } from "react-toastify";
import { useAddItemToCartMutation, useFetchCartItemsQuery } from "../../Redux/CartSlice/cartApi";
import { getToken } from "../../Redux/UserAndAuthServices/LocalStorageService";


const ShopMenuLayoutProducts = ({data,open,setOpen}) => {
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
    const [count,setCount] = useState(1);
    const [selectedProduct,setSelectedProduct] = useState(null)
    const decrementQuantity = () =>{
        if(count>1){
            setCount(count-1);
        }
    }
    const incrementQuantity = () =>{
        setCount(count+1);
    }
    const d = encodeURIComponent(data.name.replace(/\//g, '~'));
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
    const [addItemToCart] = useAddItemToCartMutation();
    const {access_token} = getToken()
    const handleAddToCart = async () => {
      try {
        if (access_token) {
          const response = await addItemToCart({ products_id: data.id, quantity: count });
          if (response.data) {
            console.log('Full response:', response);
            console.log('Response data:', response.data);
      
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
  
    useEffect(() => {
      if (!open) {
          setSelectedProduct(null); // Reset selected product when modal is closed
      }
    }, [open]);
    // const product_name = d.replace(/\s+/g,"-");
    return(
      <div className="flex items-center gap-[30px] w-[98%] rounded-sm shadow-md shadow-[gray]">
         <div>
        
        <div className=" 1280px:h-[140px] 1280px:w-[140px] overflow-hidden bg-[#242424] relative group">
        <Link to={`/product/${d}`}>
          <img src={process.env.REACT_APP_IMG_URL + data.product_imgs[0].images} alt="" className='w-full h-full 1280px:p-[1px] object-cover 
          group-hover:scale-[1.1] transition-all duration-[0.8s] delay-0 ease-in'/>
          </Link>
          <span className='quickView5 absolute  hidden 
           1350px:group-hover:block'title='Quick View'
           onClick={()=>{handleQuickView(data.id)}}><IoIosSearch size={18}/></span>
           {open && selectedProduct ? (
                  <QuickView open={open} setOpen={setOpen} data={selectedProduct}/>
                ) : null}
        </div>
   
        </div>
        <div className="flex flex-col  gap-[10px]">
          <div className="pb-[5px] pl-2">
          <Link to={`/product/${d}`}>
          <h3 className='font-[400] text-[10px] text-[#242424]'>{data.name}</h3>
          </Link>
          </div>
           <div className="flex  pl-2 items-center gap-[60px]">
            <div className="flex items-center gap-[1px]">
                <span className="text-[8px]">(</span><GiCheckMark  className="text-[#077bc4] text-[8px]"/>
                <h6 className="font-[400] text-[8px] text-[#242424]">{data.stock}</h6><span className="text-[8px]">)</span>
            </div>
            <div className="flex  items-center">
                  <h4 className={` mr-[10px] text-[13px] font-[400] line-through`}>
                    {data.price}
                    <strong className="text-[13px] font-Roboto">৳</strong>
                  </h4>
                  <h4 className={`text-[13px] font-[400] text-[#077bc4]`}>
                    {data.discount_price}
                    <strong className="text-[13px] font-Roboto">৳</strong>
                  </h4>
                </div>
           </div>
           <div className="flex items-center gap-[50px]">
           <div className={`${Styles.normal_flex} mt-3 pl-2 pr-3`}>
                  <button
                    className="py-[2px]
                             px-[10px] text-center text-white bg-[#009ccc] text-[13px]"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <span className="py-1 px-5 text-center text-[13px] font-normal">{count}</span>
                  <button
                    className="py-[2px]
                             px-[10px] text-center text-white bg-[#009ccc] text-[13px]"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>   

           <div className="pt-[10px]">
              <button className={`w-[150px] flex items-center justify-center rounded-sm cursor-pointer gap-[10px] 
              bg-[rgb(0,156,204)] text-white my-1 h-[40px] 1350px:w-[120px] 1350px:h-[32px]`} onClick={handleAddToCart}>
                <span className="uppercase font-normal text-[13px]">add to cart</span> 
                {/* <FaOpencart 
                className="font-normal text-[13px]"/>  */}
                </button>
           </div>
           </div>
     
        </div>
      </div>
    )
  }
  export default ShopMenuLayoutProducts;

  