import React, { useEffect, useRef, useState } from "react";
import "./ShopPage.scss";
import ShopStickyCategory from "../../components/ShopStickyCategory/ShopStickyCategory.jsx";
import { IoMdMenu } from "react-icons/io";
import { BiMenu, BiSolidGrid } from "react-icons/bi";
import { productData } from "../../Static/Data";
import ShopProduct from "../../components/ShopProduct/ShopProduct.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import ShopMenuLayoutProducts from "../../components/ShopMenuProducts/ShopMenuLayoutProducts.jsx";
import i4 from "../../Assets/img/ProductNotFound/img4.jpg";
import { RxCross2 } from "react-icons/rx";
import ShopSideBarCategory from "../../components/ShopSideBarCategory/ShopSideBarCategory.jsx";
// import Stock from "./Stock.jsx";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import useFetch from "../../customHooks/useFetch.js";

const ShopPage = ({ open, setOpen }) => {
  const allProducts = useFetch("api/products/");
  // console.log(allProducts);
  const [active, setActive] = useState(1);
  const [paginationByNumber, setPaginationByNumber] = useState(false);
  const [isClicked, setIsClicked] = useState(0);
  const [gridLayout, setGridLayout] = useState(false);
  const [searchParams] = useSearchParams();
  const catData = searchParams.get("category");
  const subCatData = searchParams.get("subCategory");
  // const stockStatus = searchParams.get("stock")
  // const stockStatus = searchParams.get("stock");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [stockStatus, setStockStatus] = useState(null);
  const [filterPrice, setFilterPrice] = useState(false);
  const handleChange = (event) => {
    setSelected(event.target.value);
  };
  const handleChange2 = (event) => {
    setStockStatus(event.target.value);
    // setSelected(null);
  };

  const highestPrice = allProducts && allProducts.length > 0
  ? Math.max(...allProducts.map(product => product.discount_price))
  : 0; // or any default value you'd prefer

  // console.log(highestPrice);
  const [filteredPrice, setFilteredPrice] = useState(highestPrice?highestPrice:null);
  useEffect(() => {
    if (highestPrice > 0) {
      setFilteredPrice(highestPrice);
    }
  }, [highestPrice]);

  console.log(filteredPrice);

  const handlePriceChange = (event) => {
    setFilteredPrice(Number(event.target.value));
  };

  useEffect(() => {
    if (allProducts) {
      let filteredData = allProducts;

      if (filteredPrice !== null) {
        filteredData = filteredData.filter(product => product.discount_price <= filteredPrice);
      }

      // if (selected !== null) {
      //   if (selected === '239') {
      //     filteredData = filteredData.filter((item) => item.discount_price >= 1000 && item.discount_price <= 2000);
      //   } else if (selected === '1039') {
      //     filteredData = filteredData.filter((item) => item.discount_price > 2000 && item.discount_price <= 3000);
      //   }
      // }

      if (catData !== null) {
        filteredData = filteredData.filter((item) => item.Category.catname === catData);
      }

      if (subCatData !== null) {
        filteredData = filteredData.filter((item) => item.Sub_category.subcatname === subCatData);
      }
      setData(filteredData);
    }
  }, [catData, subCatData, filteredPrice, stockStatus, allProducts]);
  console.log(data);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage =
    paginationByNumber === true
      ? isClicked === 4
        ? 4
        : null || isClicked === 6
        ? 6
        : null || isClicked === 8
        ? 8
        : null || isClicked === 10
        ? 10
        : null
      : 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const recoeds = data?.slice(firstIndex, lastIndex);
  const nPages = Math.ceil(data?.length / recordsPerPage);
  const numbers = [...Array(nPages + 1).keys()].slice(1);
  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextPage = () => {
    if (currentPage !== nPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const changeCPage = (id) => {
    setCurrentPage(id);
  };

  const pricefilterRef = useRef(null);
  useEffect(() => {
    // Function to close the shopSideBar if clicked outside
    const handleClickOutside = (event) => {
      if (pricefilterRef.current && !pricefilterRef.current.contains(event.target)) {
        setFilterPrice(false);
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pricefilterRef, setFilterPrice]);


  // Mobile side bar
  const [showSidebar, setShowSideBer] = useState(false);
  const shopSideBarRef = useRef(null);
  useEffect(() => {
    // Function to close the shopSideBar if clicked outside
    const handleClickOutside = (event) => {
      if (shopSideBarRef.current && !shopSideBarRef.current.contains(event.target)) {
        setShowSideBer(false);
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shopSideBarRef, setShowSideBer]);

  return (
    <div className="ShopSection 1350px:w-[81.5%] 1280px:w-[83%] w-[98%] mx-auto h-full">
      <div className="StickCatAndOtherFilltering hidden 1280px:block">
        <div className="shopheading"> categories</div>
        <div className="categories">
          <ShopStickyCategory />
        </div>
      </div>

      <div className="productLayout">
        <div className="textAndProductGridLayoutIcons">
          <div className="txt hidden 1280px:inline">
            <span onClick={() => navigate("/")}>home</span> /{" "}
            <span
              onClick={() => {
                navigate("/shop");
                setSelected(null);
                setPaginationByNumber(false);
                window.location.reload(true);
              }}
            >
              shop
            </span>
          </div>
          <div
            className="1280px:hidden flex items-center gap-[5px]"
            onClick={() => setShowSideBer(true)}
          >
            <BiMenu className=" text-[22px] text-[orangered] " />
            <span className="font-[400] text-[13px] capitalize text-[#242424]">
              show sidebar
            </span>
          </div>
          <div className="gridIcons ">
            <span
              onClick={() => {
                setActive(2);
                setGridLayout(true);
              }}
            >
              <IoMdMenu color={active === 2 ? "#077bc4" : ""} />
            </span>
            <span
              onClick={() => {
                setActive(1);
                setGridLayout(false);
              }}
            >
              <BiSolidGrid color={active === 1 ? "#077bc4" : ""} />
            </span>
          </div>
          <div className="itemOfProduct">
            <span className="text">show : </span>
            <span
              onClick={() => {
                setPaginationByNumber(true);
                setIsClicked(4);
              }}
            >
              <span className={`${isClicked === 4 ? "text-[#077bc4]" : ""}`}>
                4
              </span>
            </span>
            /
            <span
              onClick={() => {
                setPaginationByNumber(true);
                setIsClicked(6);
              }}
            >
              <span className={`${isClicked === 6 ? "text-[#077bc4]" : ""}`}>
                6
              </span>
            </span>
            /
            <span
              onClick={() => {
                setPaginationByNumber(true);
                setIsClicked(8);
              }}
            >
              <span className={`${isClicked === 8 ? "text-[#077bc4]" : ""}`}>
                8
              </span>
            </span>
            /
            <span
              onClick={() => {
                setPaginationByNumber(true);
                setIsClicked(10);
              }}
            >
              <span className={`${isClicked === 10 ? "text-[#077bc4]" : ""}`}>
                10
              </span>
            </span>
          </div>
        </div>
        <div className="mt-[4px] mb-[6px] w-full p-1 hidden 1280px:inline-block bg-[#009ccc]">
          <div
            className="filterPrice 1280px:w-[140px] 1350px:w-[110px] relative
           py-1 px-1 border-[rgba(0,0,0,0.2)] cursor-pointer"
          >
            <div
              className="flex items-center justify-between text-white"
              onClick={() => setFilterPrice(!filterPrice)}
            >
              <h4 className="text-[12px] font-[400]">Filter by price</h4>
              <MdOutlineKeyboardArrowDown className="text-[14px]  text-white" />
            </div>
            {filterPrice && (
              <div ref={pricefilterRef} className="absolute 1280px:w-[140px] 1350px:w-[130px] p-1 bg-[#fff] z-[999] text-center">

                 <div className="price-filter">
                    <p className="text-[12px] font-normal text-left max-w-[90%] ml-[10px]">
                      <span className="text-[12px] font-Roboto">৳</span> {Number(filteredPrice).toFixed(2)}</p>
                      <input
                        type="range"
                        value={filteredPrice}
                        className="max-w-[90%] h-[10px] outline-none border-none cursor-pointer"
                        min={Number(0).toFixed(2)}
                        max={Number(highestPrice).toFixed(2)}
                        onChange={handlePriceChange}
                      />
                    </div>
              </div>
            )}
          </div>
        </div>
        {data?.length === 0 ? (
          <div className="w-full overflow-hidden  bg-black">
            <img
              src={i4}
              alt=""
              className="w-full h-[100%] object-cover  mt-[10px]"
            />
          </div>
        ) : 
         <div>
              {paginationByNumber ? (
              <div className="300px:overflow-hidden ">
                {isClicked === 4 && (
                  <div className="">
                    {gridLayout ? (
                      <div className="flex flex-col justify-center items-center gap-[10px]">
                        {recoeds &&
                          recoeds.map((i, index) => (
                            <ShopMenuLayoutProducts
                              data={i}
                              key={index}
                              open={open}
                              setOpen={setOpen}
                            />
                          ))}
                      </div>
                    ) : (
                      <div
                        className="productsPart grid grid-cols-2 gap-[5px]
            md:grid-cols-4 md:gap[15px] lg:grid-cols-5 lg:gap-[5px] xl:grid-cols-5 p-1 300px:p-[10px] 1024px:p-1 1280px:p-[10px]"
                      >
                        {recoeds &&
                          recoeds.map((i, index) => (
                            <ShopProduct
                              data={i}
                              key={index}
                              open={open}
                              setOpen={setOpen}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}
                {isClicked === 6 && (
                  <div>
                    {gridLayout ? (
                      <div className="flex flex-col justify-center items-center gap-[10px]">
                        {recoeds &&
                          recoeds.map((i, index) => (
                            <ShopMenuLayoutProducts
                              data={i}
                              key={index}
                              open={open}
                              setOpen={setOpen}
                            />
                          ))}
                      </div>
                    ) : (
                      <div
                        className="productsPart grid grid-cols-2 gap-[5px]
            md:grid-cols-4 md:gap[15px] lg:grid-cols-5 lg:gap-[5px] xl:grid-cols-5 p-1 300px:p-[10px] 1024px:p-1 1280px:p-[10px]"
                      >
                        {recoeds &&
                          recoeds.map((i, index) => (
                            <ShopProduct
                              data={i}
                              key={index}
                              open={open}
                              setOpen={setOpen}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}
                {isClicked === 8 && (
                  <div>
                    {gridLayout ? (
                      <div className="flex flex-col justify-center items-center gap-[10px]">
                        {recoeds &&
                          recoeds.map((i, index) => (
                            <ShopMenuLayoutProducts
                              data={i}
                              key={index}
                              open={open}
                              setOpen={setOpen}
                            />
                          ))}
                      </div>
                    ) : (
                      <div
                        className="productsPart grid grid-cols-2 gap-[5px]
            md:grid-cols-4 md:gap[15px] lg:grid-cols-5 lg:gap-[5px] xl:grid-cols-5 p-1 300px:p-[10px] 1024px:p-1 1280px:p-[10px]"
                      >
                        {recoeds &&
                          recoeds.map((i, index) => (
                            <ShopProduct
                              data={i}
                              key={index}
                              open={open}
                              setOpen={setOpen}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}
                {isClicked === 10 && (
                  <div>
                    {gridLayout ? (
                      <div className="flex flex-col justify-center items-center gap-[10px]">
                        {recoeds &&
                          recoeds.map((i, index) => (
                            <ShopMenuLayoutProducts
                              data={i}
                              key={index}
                              open={open}
                              setOpen={setOpen}
                            />
                          ))}
                      </div>
                    ) : (
                      <div
                        className="productsPart grid grid-cols-2 gap-[5px]
            md:grid-cols-4 md:gap[15px] lg:grid-cols-5 lg:gap-[5px] xl:grid-cols-5 p-1 300px:p-[10px] 1024px:p-1 1280px:p-[10px]"
                      >
                        {recoeds &&
                          recoeds.map((i, index) => (
                            <ShopProduct
                              data={i}
                              key={index}
                              open={open}
                              setOpen={setOpen}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="300px:overflow-hidden ">
                {gridLayout ? (
                  <div className="flex flex-col justify-center items-center gap-[10px]
                  ">
                    {recoeds &&
                      recoeds.map((i, index) => (
                        <ShopMenuLayoutProducts
                          data={i}
                          key={index}
                          open={open}
                          setOpen={setOpen}
                        />
                      ))}
                  </div>
                ) : (
                  <div
                    className="productsPart grid grid-cols-2 gap-[5px]
            md:grid-cols-4 md:gap[15px] lg:grid-cols-5 lg:gap-[5px] xl:grid-cols-5 p-1 300px:p-[10px] 1024px:p-1 1280px:p-[10px]"
                  >
                    {recoeds &&
                      recoeds.map((i, index) => (
                        <ShopProduct
                          data={i}
                          key={index}
                          open={open}
                          setOpen={setOpen}
                        />
                      ))}
                  </div>
                )}
              </div>
            )}
         </div> 

        }



        <div className="mt-[30px] text-center mb-[30px] 768px:mb-0">
          <nav aria-label="Page navigation example ">
            <ul class="inline-flex -space-x-px ">
              <li>
                <a
                  href="#"
                  class="flex items-center text-[13px] font-[400] justify-center px-3 h-8 ms-0 leading-tight text-white bg-[#077bc4] border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={prePage}
                >
                  Previous
                </a>
              </li>
              {numbers &&
                numbers.map((n, i) => (
                  <li
                    key={i}
                    className={`${currentPage === n ? " scale-[1.1]" : ""} `}
                  >
                    <a
                      href="#"
                      class={`${
                        currentPage === n ? "text-[orangered]" : ""
                      }  text-[13px]
                flex items-center font-[400] justify-center px-3 h-8 leading-tight text-[#242424] bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                      onClick={() => changeCPage(n)}
                    >
                      {n}
                    </a>
                  </li>
                ))}

              <li>
                <a
                  href="#"
                  class="flex items-center text-[13px] font-[400] justify-center px-3 h-8 leading-tight text-white bg-[#077bc4] border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={nextPage}
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Shop SideBer */}

      {showSidebar && (
        <div className="fixed w-full h-full left-0 top-0 bg-[#0000005f] z-20">
          <div
            ref={shopSideBarRef}
            className={`${
              showSidebar ? "openSideBar" : ""
            } fixed w-[80%] 768px:w-[50%] 1024px:w-[50%] 1280px:w-[30%] bg-[#fff] 
              h-screen top-0 left-0 z-60 overflow-y-scroll`}
          >
            <div className="flex justify-end pr-3">
              <RxCross2
                className="mt-[20px] text-[#242424] text-[20px]"
                onClick={() => setShowSideBer(false)}
              />
            </div>
            <div className="mt-[10px] w-[97%] mx-auto px-[2px] py-[5px] shadow-sm shadow-[gray] rounded-sm">
              <h3
                className="uppercase font-[400] text-center
                  text-[16px] text-[rgb(7,123,196,0.8)] p-4 bg-[#eee]"
              >
                 categories
              </h3>
              <div className="w-[96%] mx-auto">
                <ShopSideBarCategory setShowSideBer={setShowSideBer} />
              </div>
            </div>
            <div className="w-[96%] mt-[50px] mx-auto shadow-sm shadow-[gray] py-2 rounded-sm">
              <h3
                className="font-[400] text-[rgb(7,123,196,0.8)] text-center
                  text-[16px] capitalize  p-[10px]"
              >
                Filter by price
              </h3>
              <div className="pt-[5px] pb-[2px] w-[90%] text-center bg-white ml-[15px] mb-[8px] rounded-sm shadow shadow-[#077bc4]">
                <div className="cursor-pointer   mb-[5px] rounded-sm ">
                <div className="price-filter">
                    <p className="text-[12px] font-normal text-left max-w-[90%] ml-[10px]">
                      <span className="text-[12px] font-Roboto">৳</span> {Number(filteredPrice).toFixed(2)}</p>
                      <input
                        type="range"
                        value={filteredPrice}
                        className="max-w-[90%] h-[10px] outline-none border-none cursor-pointer"
                        min={Number(0).toFixed(2)}
                        max={Number(highestPrice).toFixed(2)}
                        onChange={handlePriceChange}
                      />
                    </div>
                </div>
              </div>
            </div>

            {/* <div className="mt-[50px] mx-auto w-[96%] text-center rounded-sm shadow shadow-[#242424] mb-4">
              <h3 className="font-semibold text-[25px] capitalize p-[10px] bg-[#eee] rounded-md shadow shadow-[#077bc4]">
                stock status
              </h3>
              <div className="p-[5px] text-center">
                <div>
                  <input
                    type="checkbox"
                    className="h-[15px] w-[15px] mr-[5px] mb-[10px] mt-[10px] cursor-pointer"
                    onChange={(event) => {
                      handleChange2(event);
                      setShowSideBer(false);
                    }}
                    value="on sale"
                    id="slae1"
                    name="sale"
                  />
                  <label className="capitalize font-semibold text-[18px]">
                    on sale
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    className="h-[15px] w-[15px] mr-[5px] mb-[10px] cursor-pointer"
                    onChange={(event) => {
                      handleChange2(event);
                      setShowSideBer(false);
                    }}
                    value="in stock"
                    id="slae2"
                    name="sale"
                  />
                  <label className="capitalize font-semibold text-[18px]">
                    in stock
                  </label>
                </div>
              </div>
            </div> */}

          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
