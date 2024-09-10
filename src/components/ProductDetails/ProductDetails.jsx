import React, { useEffect, useRef, useState } from "react";
import Styles from "../../Styles/Styles";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GiBuyCard } from "react-icons/gi";
import d1 from "../../Assets/img/DeliveryImg/delivery1.jpg";
import { useAddItemToCartMutation, useFetchCartItemsQuery } from "../../Redux/CartSlice/cartApi";
import { toast } from "react-toastify";
import { getToken } from "../../Redux/UserAndAuthServices/LocalStorageService";
import { useNavigate } from "react-router-dom";
// import d2 from "../../Assets/img/DeliveryImg/delivery2.jpeg";

const ProductDetails = ({
  data,
  count,
  decrementQuantity,
  incrementQuantity,
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
        // Function to handle the wheel event
        const onWheel = (e) => {
            if (e.deltaY !== 0) {
                scrollContainer.scrollLeft += e.deltaY; // Scroll horizontally
                e.preventDefault(); // Prevent default vertical scroll
            }
        };

        // Attach the event listener
        scrollContainer.addEventListener('wheel', onWheel);

        // Cleanup the event listener on component unmount
        return () => scrollContainer.removeEventListener('wheel', onWheel);
    }
  }, [data]);
  // console.log(data)
  // console.log(data)
  const { data: cartItems, error, isLoading, refetch} = useFetchCartItemsQuery();
  const [addItemToCart] = useAddItemToCartMutation();
  const initialImage = data?.product_imgs?.[0]?.images ? process.env.REACT_APP_IMG_URL + data?.product_imgs?.[0]?.images : '';
  const [select, setSelect] = useState(initialImage);
  useEffect(() => {
    // Update the selected image when data is loaded or changes
    if (data?.product_imgs?.[0]?.images) {
      setSelect(process.env.REACT_APP_IMG_URL + data.product_imgs[0].images);
    }
  }, [data]);
  console.log(select);
  const {access_token} = getToken();

  const handleAddToCart = async () => {
    try {
      if (access_token) {
        const response = await addItemToCart({ products_id: data.id, quantity: count });
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
  const navigate = useNavigate();
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
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(data?.description || "", 'text/html');
  const plainTextDescription = parsedHtml.body.textContent || "";
  const [showDescription,setShowDescription] = useState(false);
  return (
    <div className="bg-white">
      {data ? (
        <div className={`w-[95%] 768px:w-[90%]  1024px:w-[98%] 1280px:w-[83%] 1350px:w-[81.5%] mx-auto
         mt-[60px] 768px:mt-[100px] lg:mt-[80px] xl:mt-0`}>
          <div className="w-full py-2 1350px:py-2">
            <div className="block w-full h-auto 1024px:flex justify-center
             shadow-sm shadow-[rgb(128,128,128,0.5)] gap-[50px] 300px:py-[20px] 1280px:py-[40px] 768px:p-[30px]">


              <div className="w-full 1024px:w-auto 1024px:mr-[30px]">
                  <div className="w-[300px] h-[300px]  overflow-hidden 300px:mx-auto 768px:mx-0 mb-[10px]">
                    <img
                      src={select}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                
                  <div style={{ width: '300px', overflowX: 'scroll' }} ref={scrollRef} className='no-scrollbar 300px:mx-auto 768px:mx-0'>
                                <div style={{ display: 'flex', gap: '5px', width: 'max-content' }}>
                                    {data?.product_imgs?.map((image, i) => (
                                        <img
                                            key={i}
                                            src={process.env.REACT_APP_IMG_URL + image.images}
                                            alt=""
                                            onClick={() => setSelect(process.env.REACT_APP_IMG_URL + image.images)}
                                            style={{ width: '55px', height: '55px', cursor: 'pointer', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.2)' }}
                                        />
                                    ))}
                                </div>
                            </div>

              </div>


              <div className="w-[90%] mx-auto 768px:mx-0 768px:w-full 1024px:w-[600px] 768px:pt-0 1280px:pt-[50px] pt-[20px]">
                <h1 className={`text-[16px] text-[#242424] font-normal`}>{data?.name}</h1>
                <p className={`font-[400] text-[rgb(71,66,66)] pt-4 text-[12px]`}>
                {plainTextDescription?.length > 200 ? (
                          <>
                            {plainTextDescription?.slice(0, 200)}
                            {showDescription === true ? (plainTextDescription?.slice(200,-1)+".") : "...."}
                          </>
                        ) : (
                          plainTextDescription
                        )}{" "}
                  {plainTextDescription?.length >= 200 ? (
                    <>
                    <span className={`font-[500] 1350px:text-[12px] text-[#242424] cursor-pointer ${showDescription===true?"hidden":"inline"}`}
                  onClick={()=>setShowDescription(true)}>Read more...</span> 
                  
                  <span className={`font-[500] 1350px:text-[12px] text-[#242424] cursor-pointer ${showDescription===false?"hidden":"inline"}`}
                  onClick={()=>setShowDescription(false)}>hide description...</span>
                    </>
                  ) : null}      
                  
                </p>
                <div className="flex pt-4 items-center">
                  <h4 className={` mr-[10px] font-normal text-[13px] line-through`}>
                    {data?.price}
                    <strong className="text-[13px] font-Roboto">৳</strong>
                  </h4>
                  <h4 className={`text-[13px] font-normal text-[#077bc4]`}>
                    {data?.discount_price}
                    <strong className="text-[13px] font-Roboto">৳</strong>
                  </h4>
                </div>
                <div className={`${Styles.normal_flex} mt-4 1350px:mt-5 pr-3`}>
                  <button
                    className="py-[2px]
                             px-[10px] text-center text-white bg-[#077bc4] text-[13px] font-normal"
                    onClick={decrementQuantity}
                  >
                    -
                  </button>
                  <span className="py-1 px-5 text-center text-[13px]">{count}</span>
                  <button
                    className="py-[2px] 
                             px-2 text-center text-white bg-[#077bc4] text-[13px]"
                    onClick={incrementQuantity}
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center mt-4 1350px:mt-5 gap-[30px]">
                  <div
                    className={`flex items-center justify-center
                      cursor-pointer bg-[#077bc4] w-[130px] h-[35px] 1350px:my-2 
                      addCart rounded-sm`}
                    onClick={handleAddToCart}>
                    <span className="text-white font-[400] flex items-center text-[13px]">
                      Add to cart <AiOutlineShoppingCart className="ml-2 text-[13px]" />
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-center
                      cursor-pointer bg-[rgb(255,69,0,0.8)] w-[130px] h-[35px] 
                      1350px:my-2 buy rounded-sm`}
                      onClick={handleBuyNow}
                  >
                    <span className="text-[#fff] font-[400] flex items-center text-[13px]">
                      Buy now <GiBuyCard className="ml-2 text-[13px]" />
                    </span>
                  </div>
                </div>
              </div>


            </div>
          </div>
          <ProductDetailsInfo data={data} plainTextDescription={plainTextDescription}/>
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({ data,plainTextDescription }) => {
  const [active, setActive] = useState(1);
  return (
    <div className="bg-[rgb(245,246,251,0.7)] px-3 800px:px-10 py-2 1350px:px-[58px] 1350px:py-[30px] rounded  1350px:mt-[70px] 1350px:mb-[50px]">
      <div className="w-full flex justify-between border-b pt-5 pb-2">
        <div className="relative">
          <h5
            className="text-[#242424] px-1 leading-5 font-[400] 
                    cursor-pointer text-[13px]"
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${Styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative hidden 768px:inline">
          <h5
            className="text-[#242424] px-1 leading-5 font-[400] 
                    cursor-pointer text-[13px]"
            onClick={() => setActive(2)}
          >
            Additional Information
          </h5>
          {active === 2 ? (
            <div className={`${Styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#242424] px-1 leading-5 font-[400] 
                    cursor-pointer text-[13px]"
            onClick={() => setActive(3)}
          >
            Shipping & Delivery
          </h5>
          {active === 3 ? (
            <div className={`${Styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p
            className="py-2 1280px:w-[40%] w-[98%]
                    text-[12px] leading-4 pb-5 whitespace-pre-line font-[400] text-[#242424]"
          >
            {plainTextDescription}
          </p>
         
        </>
      ) : null}
      {active === 2 ? (
        <div className="w-full min-h-[30vh] flex items-center justify-around">
          <h4 className="font-[400]  text-[#242424] text-[12px]">Weigth</h4>
          <p className="font-[400] text-[#077bc4] text-[12px]">2.5kg</p>
        </div>
      ) : null}
      {active === 3 ? (
        <div className="w-full flex flex-col 768px:flex-row items-center justify-around 768px:px-5 px-1">
          <div className="768px:w-[40%] w-[98%] overflow-hidden my-5 bg-[#f5f6fb]">
            <img src={d1} alt="" className="w-full object-contain" />
          </div>
          <div className="768px:w-[40%] w-[90%]">
            <h1
              className="font-[400]
                    text-[#242424] text-[16px] 768px:mt-[10px] mt-0 lg:mt-0"
            >
              Service Provider :
            </h1>
            <p className=" pt-1 font-[400] text-[12px] text-[#242424] capitalize">
              We usually use <span className="text-[#077bc4]">Pathao</span> ,{" "}
              <span>
                Red<span className="italic text-[red] text-[13px]">X</span>
              </span>{" "}
              or Steadfast{" "}
              <span className="text-[orangered]">Courier Service</span> Provider
              to shipping our products.
            </p>
            <h3 className="pt-3 text-[16px] capitalize font-[400] text-[#242424]">
              shipping time :
            </h3>
            <p className="capitalize font-[400] text-[12px]  pt-1">
              <span className=" text-[red]">7</span>{" "}
              <span className="text-[red]">days</span> minimum
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
