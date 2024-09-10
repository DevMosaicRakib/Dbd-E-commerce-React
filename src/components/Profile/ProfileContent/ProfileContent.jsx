import React, { useEffect, useRef, useState } from "react";
// import { CgProfile } from "react-icons/cg";
import Styles from "../../../Styles/Styles";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineArrowRight, AiOutlineDelete } from "react-icons/ai";
// import o1 from "../../../Assets/img/NoOrder/nnd.png";
import o2 from "../../../Assets/img/NoOrder/noOrder2.png";
// import a1 from "../../../Assets/img/NoAddress/a1.png";
// import a2 from "../../../Assets/img/NoAddress/a2.png";
// import a3 from "../../../Assets/img/NoAddress/a3.webp";
import { RiErrorWarningLine } from "react-icons/ri";
// import { LiaShippingFastSolid } from "react-icons/lia";
// import { MdOutlineMapsHomeWork } from "react-icons/md";
// import { MdEditLocationAlt } from "react-icons/md";
// import { RiMapPinAddFill } from "react-icons/ri";
import { RiAccountBoxLine } from "react-icons/ri";
import { MdOutlineKey } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { IoCameraSharp } from "react-icons/io5";
// import pI from "../../../Assets/img/ProfileImg/developer.png"
import {
  useChangeUserPasswordMutation,
  useUpdateUserProfileMutation,
} from "../../../Redux/UserAndAuthServices/userAuthApi";
import { getToken } from "../../../Redux/UserAndAuthServices/LocalStorageService";
import { toast } from "react-toastify";
import {
  useAddCustomerBillingAddressMutation,
  useAddCustomerShippingAddressMutation,
  useFetchCustomerBillingAddressesQuery,
  useFetchCustomerShippingAddressesQuery,
  useDeleteCustomerShippingAddressMutation,
  useDeleteCustomerBillingAddressMutation,
  useUpdateCustomerShippingAddressMutation,
  useUpdateCustomerBillingAddressMutation,
} from "../../../Redux/AddressSlice/addressApi";
import axios from "axios";

const ProfileContent = ({
  active,
  data,
  profilerefetch,
  isForm,
  setIsForm,
  billingAddressForm,
  setBillingAddressForm,
  shippingForm,
  setShippingForm,
  isEditMode,
  setIsEditMode,
  currentAddressId,
  setCurrentAddressId,
  formData,
  setFormData,
  resetForm
}) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const { access_token } = getToken();
  const [isInitialized, setIsInitialized] = useState(false);
  const [updateProfile, setUpdateProfile] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    profile_picture: null,
  });

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);
  console.log(userInfo);

  useEffect(() => {
    if (data && !isInitialized) {
      setUpdateProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        profile_picture: null,
      });
      setIsInitialized(true);
    }
  }, [data, isInitialized]);
  // console.log(updateProfile)

  const handleChangeProfile = (e) => {
    const { name, value, type, files } = e.target;
    setUpdateProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(updateProfile).forEach((key) => {
      if (updateProfile[key]) {
        formData.append(key, updateProfile[key]);
      }
    });

    try {
      await updateUserProfile({ data: formData, access_token: access_token });
      toast.success("Profile updated successfully");
      profilerefetch();
      console.log(data);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };
  // console.log(data)
  const handleFocus = (field) => {
    toast.error(`${field} is not changeable.`);
  };
  // const [billingAddressForm, setBillingAddressForm] = useState(false);
  // const [shippingForm, setShippingForm] = useState(false);
  const [billingAddress, setBillingAddress] = useState([]);
  const [shippingAddress, setShippingAddress] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [server_error, setServerError] = useState({});

  const [changeUserPassword] = useChangeUserPasswordMutation();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const actualData = {
      old_password: data.get("old_password"),
      password: data.get("password"),
      password2: data.get("password2"),
    };
    console.log(actualData);
    const res = await changeUserPassword({ actualData, access_token });
    if (res.error) {
      // setServerMsg({})
      console.log(res.error.data.errors);
      setServerError(res.error.data.errors);
      if (res.error.data.errors.non_field_errors) {
        toast.error(res.error.data.errors.non_field_errors[0]);
      }
    }
    if (res.data) {
      toast.success(res.data.msg);
      setServerError({});
      // setServerMsg(res.data)
      document.getElementById("password-change-form").reset();
    }
  };

  // Address Functions
  const {
    data: shipaddresses,
    error,
    isLoading,
    refetch: refetchShippingAddresses,
  } = useFetchCustomerShippingAddressesQuery();
  // console.log(shipaddresses)
  const { data: Billaddresses, refetch: refetchBillingAddresses } =
    useFetchCustomerBillingAddressesQuery();
  // console.log(Billaddresses)

  const [addCustomerShippingAddress] = useAddCustomerShippingAddressMutation();
  const [addCustomerBillingAddress] = useAddCustomerBillingAddressMutation();
  const [deleteCustomerShippingAddress] =
    useDeleteCustomerShippingAddressMutation();
  const [deleteCustomerBillingAddress] =
    useDeleteCustomerBillingAddressMutation();
  const [updateCustomerSippingAddress] =
    useUpdateCustomerShippingAddressMutation();
  const [updateCustomerBillingAddress] =
    useUpdateCustomerBillingAddressMutation();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditBillingAddress = (address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      email: address.email,
      address: address.address,
      city: address.city,
      zip_code: address.zip_code,
      customization: address.customization,
      country: address.country,
    });
    setIsForm(true);
    setBillingAddressForm(true);
    setShippingForm(false);
    setBillingAddress(true);
    setShippingAddress(false);
    setIsEditMode(true);
    setCurrentAddressId(address.id);
  };

  const handleEditShippingAddress = (address) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      email: address.email,
      address: address.address,
      city: address.city,
      zip_code: address.zip_code,
      customization: address.customization,
      country: address.country,
    });
    setIsForm(true);
    setBillingAddressForm(false);
    setShippingForm(true);
    setBillingAddress(false);
    setShippingAddress(true);
    setIsEditMode(true);
    setCurrentAddressId(address.id);
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateCustomerSippingAddress({
          shipping_address_id: currentAddressId,
          ...formData,
        });
        toast.success("Shipping address updated succesfully");
      } else {
        await addCustomerShippingAddress(formData);
        toast.success("Shipping address added succesfully");
      }
      resetForm();
      setIsForm(false);
      setShippingForm(false);
      setShippingAddress(false);
      setIsEditMode(false);
      setCurrentAddressId(null);
      refetchShippingAddresses();
    } catch (error) {
      console.error("Error creating shipping address:", error);
    }
  };

  const handleBillingSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateCustomerBillingAddress({
          billing_address_id: currentAddressId,
          ...formData,
        });
        toast.success("Billing address updated succesfully");
      } else {
        await addCustomerBillingAddress(formData);
        toast.success("Billing address added succesfully");
      }
      resetForm();
      setIsForm(false);
      setBillingAddressForm(false);
      setBillingAddress(false);
      setIsEditMode(false);
      setCurrentAddressId(null);
      refetchBillingAddresses();
    } catch (error) {
      console.error("Error creating shipping address:", error);
    }
  };
  const handleDeleteShippingAddress = async (id) => {
    try {
      const res = await deleteCustomerShippingAddress(id);
      console.log(res);
      toast.success(res.data.msg);
      refetchShippingAddresses();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteBillingAddress = async (id) => {
    try {
      const res = await deleteCustomerBillingAddress(id);
      console.log(res);
      toast.success(res.data.msg);
      refetchBillingAddresses();
    } catch (error) {
      console.error(error);
    }
  };

  // Customer Order Fetch
  const [order,setOrder] = useState([]);
  const allOrders = async ()=>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}api/allorders/`,
        {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}`
          }
      }
      )
      console.log(response.data)
      setOrder(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    allOrders();
  },[])


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full">
      {active === 1 && (
        <>
          <div
            className="w-full  1500px:ml-[100px] 300px:pl-[30px] 1024px:pl-[60px]
          1500px:pl-0 ml-0"
          >
            <div className="flex items-center gap-[15px]">
              {/* <CgProfile  color="#242424" className="text-[28px] 1350px:text-[26px]"/> */}
              <div
                className="w-[60px] h-[60px] rounded-full cursor-pointer
              border-[2px] border-[#33cc00] overflow-hidden"
                onClick={handleImageClick}
              >
                <img
                  src={
                    process.env.REACT_APP_IMG_URL + data.profile_picture ||
                    userInfo.picture
                  }
                  alt=""
                  className="w-full h-full"
                />
              </div>
              <span className="text-[#077bc4] font-[400] text-[16px]">
                Welcome!{" "}
                <span
                  className="text-[#242424] capitalize 
                   font-[400] ml-[5px] mt-[2px] text-[16px]"
                >
                  {data.username || userInfo.name}
                </span>
              </span>
            </div>
            {/* <br /> */}
          </div>
          <div className="w-full px-4 1500px:ml-[50px] 300px:pl-[20px] 1024px:pl-[80px] 1500px:pl-0 ml-0 mt-[10px]">
            <form onSubmit={handleProfileSubmit}>
              <div className="w-full flex flex-col pb-3 1350px:pb-[6px] 768px:gap-[10px] 300px:gap-[10px]">
                <div className="1024px:w-[50%] 768px:w-[70%] 300px:w-[100%]">
                  <label className="block pb-2 1024px:pb-[4px] font-normal text-[13px]">
                    First Name :
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={updateProfile.first_name || data.first_name}
                    onChange={handleChangeProfile}
                    className={`${Styles.input} 1350px:p-[4px] !w-[95%] text-[10px] font-normal
                    border-[1px] border-[rgba(0,0,0,0.3)]`}
                    required
                  />
                </div>
                <div className="1024px:w-[50%] 768px:w-[70%] 300px:w-[100%]">
                  <label className="block pb-2 1024px:pb-[4px] font-normal text-[13px]">
                    Last Name :
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={updateProfile.last_name || data.last_name}
                    onChange={handleChangeProfile}
                    className={`${Styles.input} 1350px:p-[4px] !w-[95%] text-[10px] font-normal 
                    border-[1px] border-[rgba(0,0,0,0.3)]`}
                    required
                  />
                </div>
                <div className="1024px:w-[50%] 768px:w-[70%] 300px:w-[100%]">
                  <label className="block pb-2 1024px:pb-[4px] font-normal text-[13px]">
                    UserName :
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={updateProfile.username || data.username}
                    onChange={handleChangeProfile}
                    className={`${Styles.input} 1350px:p-[4px] !w-[95%] text-[10px] font-normal
                     border-[1px] border-[rgba(0,0,0,0.3)]`}
                    required
                    readOnly
                    onFocus={() => {
                      handleFocus("Username");
                    }}
                  />
                </div>
                <div className="1024px:w-[50%] 768px:w-[70%] 300px:w-[100%]">
                  <label className="block pb-2 1024px:pb-[4px] font-normal text-[13px]">
                    Email :
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={updateProfile.email || data.email}
                    onChange={handleChangeProfile}
                    className={`${Styles.input} 1350px:p-[4px] !w-[95%] text-[10px] font-normal
                     border-[1px] border-[rgba(0,0,0,0.3)]`}
                    required
                    readOnly
                    onFocus={() => {
                      handleFocus("Email");
                    }}
                  />
                </div>
                <div className="1024px:w-[50%] 768px:w-[70%] 300px:w-[100%] hidden">
                  <label className="block pb-2 1024px:pb-[4px] font-normal text-[13px]">
                    Upload profile image :
                  </label>
                  <input
                    type="file"
                    name="profile_picture"
                    ref={fileInputRef}
                    onChange={handleChangeProfile}
                    className={`${Styles.input} 1350px:p-[4px] !w-[95%] 1350px:text-[12px] outline-none border-0`}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-[10px] 1024px:mt-[5px] 1350px:mt-[2px] 1350px:p-[5px]
                    768px:p-2 p-1 border bg-[#077bc4] text-white 
                   text-[13px] font-[400] 1350px:w-[120px] 1024px:w-[15%] 768px:w-[20%] 300px:w-[50%] rounded-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* order Page */}

      {active === 2 && (
        <div className="w-full ">
          <AllOrders orders={order}/>
        </div>
      )}

      {/* Address Page */}
      {active === 4 && (
        <div className="1024px:pl-8 768px:pl-2 pl-1 pt-3 1024px:pt-0">
          {isForm ? (
            <div className="">
              {billingAddressForm ? (
                <div className="">
                  <div className="pl-1 pt-3 1024px:pt-0 1024px:w-[70%] w-[100%]">
                    <h1
                      className="1280px:text-[20px] text-[16px] text-[#242424] 
                            font-[400] capitalize px-2 768px:ml-[30px] 1350px:ml-[20px] "
                    >
                      Billing Address
                    </h1>
                    <form
                      className="mt-[10px] 1024px:mt-[6px] 768px:ml-[30px] ml-[10px]"
                      onSubmit={handleBillingSubmit}
                    >
                      <div className="w-full flex flex-col pb-3 768px:gap-[10px] gap-[10px] 1350px:gap-[5px]">
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%]">
                          <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                            {" "}
                            Name :
                          </label>
                          <input
                            type="text"
                            name="name"
                            className={`${Styles.input} 1350px:p-[4px] font-normal text-[10px] !w-[95%]
                                  border-[1px] border-[rgba(0,0,0,0.3)]`}
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%] flex items-center">
                          <div className="w-[49%]">
                            <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                              Phone :
                            </label>
                            <input
                              type="text"
                              name="phone"
                              className={`${Styles.input} 1350px:p-[4px] text-[10px] font-normal !w-[95%]
                                    border-[1px] border-[rgba(0,0,0,0.3)]`}
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="w-[49%]">
                            <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                              Email :
                            </label>
                            <input
                              type="email"
                              name="email"
                              className={`${Styles.input} 1350px:p-[4px] font-normal text-[10px] !w-[95%]
                                    border-[1px] border-[rgba(0,0,0,0.3)]`}
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%]">
                          <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                            Address :
                          </label>
                          <textarea
                            cols="50"
                            rows="2"
                            className={`${Styles.input} 1350px:px-[4px] text-[10px] font-normal !w-[95%]
                                  border-[1px] border-[rgba(0,0,0,0.3)]`}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%] flex items-center">
                          <div className="w-[49%]">
                            <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                              Town / City :
                            </label>
                            <input
                              type="text"
                              name="city"
                              className={`${Styles.input} 1350px:p-[4px] font-normal text-[10px] !w-[95%]
                                    border-[1px] border-[rgba(0,0,0,0.3)]`}
                              value={formData.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="w-[49%]">
                            <label className="block pb-1  1024px:pb-0 font-normal text-[13px]">
                              Postcode / ZIP :
                            </label>
                            <input
                              type="text"
                              name="zip_code"
                              className={`${Styles.input} 1350px:p-[4px] font-normal text-[10px] !w-[95%]
                                    border-[1px] border-[rgba(0,0,0,0.3)]`}
                              value={formData.zip_code}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%]">
                          <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                            Customization :
                          </label>
                          <textarea
                            cols="50"
                            rows="2"
                            className={`${Styles.input} 1350px:px-[4px] font-normal text-[10px] !w-[95%]
                                  border-[1px] border-[rgba(0,0,0,0.3)]`}
                            name="customization"
                            value={formData.customization}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%]">
                          <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                            Country :
                          </label>
                          <input
                            type="text"
                            name="country"
                            className={`${Styles.input} 1350px:p-[4px] font-normal text-[10px] !w-[95%]
                                  border-[1px] border-[rgba(0,0,0,0.3)]`}
                            value={formData.country}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="mt-[10px] 1024px:mt-[5px]
                            py-1 px-2 border bg-[#077bc4] text-white text-[13px]
                             font-[400] 1350px:w-[120px] 1024px:w-[25%] 768px:w-[25%] w-[50%] rounded-sm"
                          // onClick={() => {
                          //   setIsForm(false);
                          //   setBillingAddressForm(false);
                          //   setBillingAddress(false);
                          // }}
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : null}
              {shippingForm ? (
                <div className="">
                  <div className="pl-1 pt-3 1024px:pt-0 1024px:w-[70%] w-[100%]">
                    <h1
                      className="1350px:text-[20px] text-[16px] text-[#242424] 
                          font-[400] capitalize px-2 768px:ml-[30px] 1350px:ml-[20px] ml-0"
                    >
                      Shipping Address
                    </h1>
                    <form
                      className="mt-[10px] 1024px:mt-[8px] 768px:ml-[30px] ml-[10px]"
                      onSubmit={handleShippingSubmit}
                    >
                      <div className="w-full flex flex-col pb-3 768px:gap-[10px] gap-[10px] 1350px:gap-[5px]">
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%]">
                          <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                            {" "}
                            Name :
                          </label>
                          <input
                            type="text"
                            name="name"
                            className={`${Styles.input} 1350px:p-[4px] font-normal text-[10px] !w-[95%]
                                  border-[1px] border-[rgba(0,0,0,0.3)]`}
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%] flex items-center">
                          <div className="w-[49%]">
                            <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                              Phone :
                            </label>
                            <input
                              type="text"
                              name="phone"
                              className={`${Styles.input} 1350px:p-[4px] text-[10px] font-normal !w-[95%]
                                    border-[1px] border-[rgba(0,0,0,0.3)]`}
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="w-[49%]">
                            <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                              Email :
                            </label>
                            <input
                              type="email"
                              name="email"
                              className={`${Styles.input} 1350px:p-[4px] font-normal text-[10px] !w-[95%]
                                    border-[1px] border-[rgba(0,0,0,0.3)]`}
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%]">
                          <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                            Address :
                          </label>
                          <textarea
                            cols="50"
                            rows="2"
                            className={`${Styles.input} 1350px:px-[4px] text-[10px] font-normal !w-[95%]
                                  border-[1px] border-[rgba(0,0,0,0.3)]`}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%] flex items-center">
                          <div className="w-[49%]">
                            <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                              Town / City :
                            </label>
                            <input
                              type="text"
                              name="city"
                              className={`${Styles.input} 1350px:p-[4px] font-normal text-[10px] !w-[95%]
                                    border-[1px] border-[rgba(0,0,0,0.3)]`}
                              value={formData.city}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="w-[49%]">
                            <label className="block pb-1  1024px:pb-0 font-normal text-[13px]">
                              Postcode / ZIP :
                            </label>
                            <input
                              type="text"
                              name="zip_code"
                              className={`${Styles.input} 1350px:p-[4px] font-normal text-[10px] !w-[95%]
                                    border-[1px] border-[rgba(0,0,0,0.3)]`}
                              value={formData.zip_code}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%]">
                          <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                            Customization :
                          </label>
                          <textarea
                            cols="50"
                            rows="2"
                            className={`${Styles.input} 1350px:px-[4px] font-normal text-[10px] !w-[95%]
                                  border-[1px] border-[rgba(0,0,0,0.3)]`}
                            name="customization"
                            value={formData.customization}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                        <div className="1024px:w-[80%] 1350px:w-[60%] 768px:w-[70%] w-[100%]">
                          <label className="block pb-1 1024px:pb-0 font-normal text-[13px]">
                            Country :
                          </label>
                          <input
                            type="text"
                            name="country"
                            className={`${Styles.input} 1350px:p-[4px] font-normal text-[10px] !w-[95%]
                                  border-[1px] border-[rgba(0,0,0,0.3)]`}
                            value={formData.country}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="mt-[10px] 1024px:mt-[5px]
                            py-1 px-2 border bg-[#077bc4] text-white text-[13px]
                             font-[400] 1350px:w-[120px] 1024px:w-[25%] 768px:w-[25%] w-[50%] rounded-sm"
                          // onClick={() => {
                          //   setIsForm(false);
                          //   setBillingAddressForm(false);
                          //   setBillingAddress(false);
                          // }}
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <div className="1024px:pl-8 768px:pl-2 pl-1 pt-3 1024px:pt-0">
                <div className="flex flex-col gap-[30px] 1350px:gap-[20px] 768px:gap-[40px] 1024px:pb-5 pb-0 w-full">
                  <div className="w-full flex justify-between items-center">
                    <h1
                      className="1350px:text-[20px] text-[16px] text-[#242424]
                      font-[400] capitalize 768px:ml-[30px] 1350px:ml-[20px] ml-[8px] "
                    >
                      Billing Addresses
                    </h1>
                    <div
                      className="py-1 px-2 border bg-[#077bc4] text-white text-[13px]
                       font-[400] mr-2
                      1350px:mr-5 768px:mr-[50px] rounded-sm cursor-pointer"
                      onClick={() => {
                        setIsForm(true);
                        setBillingAddressForm(true);
                        setShippingForm(false);
                        setShippingAddress(false);
                        setBillingAddress(true);
                        setIsEditMode(false);
                      }}
                    >
                      Add New
                    </div>
                  </div>

                  {Billaddresses?.length ? (
                    <div className="w-full grid grid-cols-1 768px:grid-cols-2 gap-[10px]">
                      {Billaddresses &&
                        Billaddresses.map((address, index) => (
                          <div
                            className="w-[90%] mx-auto bg-white h-auto rounded-sm shadow mb-5 flex flex-col 1350px:gap-[10px]
                                                    gap-[20px] py-3 px-5 border border-transparent hover:border-[#077bc4] relative"
                            key={index}
                          >
                            <div className="w-full flex justify-between items-center">
                              <h3 className="font-[400] text-[14px]">
                                Billing Address {index + 1}
                              </h3>
                              <div
                                className="text-[#242424] ml-[10px] cursor-pointer text-[13px] font-normal
                                                        py-1 px-4 w-[60px] bg-transparent border-[1px] border-[rgb(128,128,128,0.4)]
                                                        hover:bg-[rgb(128,128,128,0.2)]"
                                onClick={() => {
                                  handleEditBillingAddress(address) &&
                                    setIsEditMode(true);
                                }}
                              >
                                Edit
                              </div>
                            </div>
                            <div className="flex items-center absolute right-0 bottom-4">
                              <AiOutlineDelete
                                size={18}
                                className="cursor-pointer mr-5 text-[orangered]"
                                onClick={() =>
                                  handleDeleteBillingAddress(address.id)
                                }
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.name}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.email}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.phone}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.address}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.city}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.zip_code}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.country}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.customization}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="w-auto text-[12px] font-normal mx-auto py-2 px-4 bg-white
                    shadow-sm border-[1px] border-[rgb(128,128,128,0.2)] text-center text-[#242424]">
                      You don't have any billing address yet, for add an address click on <span className='text-[#077bc4]'>Add New</span> button.
                    </div>
                  )}

                  <div className="w-full flex justify-between items-center">
                    <h1
                      className="1350px:text-[20px] text-[16px] text-[#242424]
                      font-[400] capitalize 768px:ml-[30px] 1350px:ml-[20px] ml-[8px]"
                    >
                      Shipping Addresses
                    </h1>
                    <div
                      className="py-1 px-2 border bg-[#077bc4] text-white text-[13px]
                       font-[400] mr-2
                      1350px:mr-5 768px:mr-[50px] rounded-sm cursor-pointer"
                      onClick={() => {
                        setIsForm(true);
                        setBillingAddressForm(false);
                        setShippingForm(true);
                        setShippingAddress(true);
                        setBillingAddress(false);
                        setIsEditMode(false);
                      }}
                    >
                      Add New
                    </div>
                  </div>
                   {shipaddresses?.length ? (
                  <div className="w-full grid grid-cols-1 768px:grid-cols-2 gap-[10px]">
                  {shipaddresses &&
                    shipaddresses.map((address, index) => (
                      <div
                        className="w-[90%] mx-auto bg-white h-auto rounded-md shadow mb-5 flex flex-col 1350px:gap-[10px]
                          gap-[20px] py-3 px-5 border border-transparent hover:border-[#077bc4] relative"
                        key={index}
                      >
                        <div className="w-full flex justify-between items-center">
                          <h3 className="font-[400] text-[14px]">
                            Shipping Address {index + 1}
                          </h3>
                          <div
                            className="text-[#242424] ml-[10px] cursor-pointer text-[13px] font-normal
                                                        py-1 px-4 w-[60px] bg-transparent border-[1px] border-[rgb(128,128,128,0.4)]
                                                        hover:bg-[rgb(128,128,128,0.2)]"
                            onClick={() => {
                              handleEditShippingAddress(address) &&
                                setIsEditMode(true);
                            }}
                          >
                            Edit
                          </div>
                        </div>
                        <div className="flex items-center absolute right-0 bottom-4">
                          <AiOutlineDelete
                            size={18}
                            className="cursor-pointer mr-5 text-[orangered]"
                            onClick={() =>
                              handleDeleteShippingAddress(address.id)
                            }
                          />
                        </div>
                        <div className="flex flex-col">
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.name}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.email}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.phone}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.address}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.city}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.zip_code}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.country}
                              </span>
                              <span className="overflow-hidden text-ellipsis text-[12px] font-normal w-[220px]">
                                {address.customization}
                              </span>
                        </div>
                      </div>
                    ))}
                </div>
                   ) : (
                    <div className="w-auto text-[12px] font-normal mx-auto py-2 px-4 bg-white
                    shadow-sm border-[1px] border-[rgb(128,128,128,0.2)] text-center text-[#242424]">
                      You don't have any shipping address yet, for add an address click on <span className='text-[#077bc4]'>Add New</span> button.
                    </div>
                   )}   


                </div>
              </div>
            </>
          )}
        </div>
      )}

      {active === 5 && (
        <div className="1280px:pl-14 768px:pl-6 pl-[5px] pt-3 1024px:pt-0 w-full">
          <div
            className="bg-white 1280px:w-[63%] 1350px:w-[45%] 768px:w-[90%] 1024px:w-[80%] w-[99.5%]
           py-2 px-3 rounded-sm shadow-sm  shadow-[gray]"
          >
            <div className="flex items-center text-[#077bc4]">
              <RiAccountBoxLine className="pr-[5px] text-[25px] " />
              <h1
                className="text-[14px]
                    font-normal capitalize "
              >
                account details
              </h1>
            </div>
            <div
              className="w-full overflow-hidden  
                                1280px:px-[25px] 768px:px-[15px] px-[5px] pb-[15px] 1024px:pb-[5px] flex flex-col justify-center gap-[1px]"
            >
              <h5
                className="text-[12px] font-[400] text-[#242424]"
              >
                Name :{" "}
                {data.first_name && data.last_name && (
                    <span className="text-[12px] font-[400] text-[#242424] ml-[5px]">
                    {data.first_name + " " + data.last_name}
                  </span>
                )}
                
              </h5>
              <h5
                className="text-[12px] font-[400] text-[#242424]"
              >
                Email :{" "}
                <span className="text-[12px] font-[400] text-[#242424] 768px:ml-[5px] ml-[1px]">
                  {data.email}
                </span>
              </h5>
              <h5
                className="text-[12px] font-[400] text-[#242424]"
              >
                Username :{" "}
                <span className="text-[12px] font-[400] text-[#242424] ml-[5px]">
                  {data.username}
                </span>
              </h5>
            
            </div>
            <h4
              className="pt-[10px] 1024px:pt-[5px] text-[12px] font-[400] text-[#242424] 
            768px:pl-[10px] pl-[5px] capitalize pb-[20px] 1024px:pb-[5px]"
            >
              <span className="text-[orangered] ">
                if you wish to change your{" "}
                <span className="text-[red]">
                  password{" "}
                  <MdOutlineKey className="inline text-[12px]" />
                </span>
              </span>
              ,{" "}
              <span className="text-[orange]">
                {" "}
                please follow the instructions below
              </span>
            </h4>
            <div className="pt-[10px] 1024px:pt-[5px]">
              <div className="flex items-center gap-[5px]">
                <RiLockPasswordLine className="text-[#077bc4] text-[20px] " />
                <h1
                  className="text-[#077bc4] text-[14px] capitalize
                     font-[400] mt-[3px]"
                >
                  change password
                </h1>
              </div>
              <form id="password-change-form" onSubmit={handleSubmit}>
                <div
                  className="1024px:pt-[5px] pt-[10px] 768px:pl-[25px] pl-[5px] 1024px:w-[60%] 768px:w-[80%] w-[100%] 
                pb-[3px] 1350px:pb-0"
                >
                  <label className="block font-normal text-[#242424] text-[12px]">
                    Current Password :
                  </label>
                  <div className="mt-1 1024px:mt-0 relative w-full">
                    <input
                      type={visible ? "text" : "password"}
                      name="old_password"
                      placeholder="Enter current password***"
                      // value={password}
                      // onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block !w-[100%] px-3 py-2 1280px:py-[6px] border border-gray-300 rounded-md 
                  shadow-sm placeholder-gray-500 text-[10px] font-normal
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                    />
                    {server_error.old_password ? (
                      <p className="pt-[3px] font-[400] text-[10px] text-[red]">
                        {server_error.old_password[0]}
                      </p>
                    ) : (
                      ""
                    )}
                    {visible ? (
                      <AiOutlineEye
                        className="absolute right-3 top-2 1350px:top-[6px] cursor-pointer text-[16px] text-gray-500"
                        onClick={() => setVisible(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute right-3 top-2 1350px:top-[6px] text-[16px] cursor-pointer text-gray-500"
                        onClick={() => setVisible(true)}
                      />
                    )}
                  </div>
                </div>
                <div
                  className=" 1024px:pt-[5px] pt-[10px] 768px:pl-[25px] pl-[5px] 1024px:w-[60%] 768px:w-[80%] w-[100%] 
                pb-[3px] 1350px:pb-0"
                >
                  <label className="block font-normal text-[#242424] text-[12px]">
                    New Password :
                  </label>
                  <div className="mt-1 1024px:mt-0 relative w-full">
                    <input
                      type={visible1 ? "text" : "password"}
                      name="password"
                      placeholder="Enter new password***"
                      // value={password1}
                      // onChange={(e) => setPassword1(e.target.value)}
                      className="appearance-none block !w-[100%] px-3 py-2 1280px:py-[6px] border border-gray-300 rounded-md 
                  shadow-sm placeholder-gray-500 text-[10px]
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                    />
                    {server_error.password ? (
                      <p className="pt-[3px] font-[400] text-[10px] text-[red]">
                        {server_error.password[0]}
                      </p>
                    ) : (
                      ""
                    )}
                    {visible1 ? (
                      <AiOutlineEye
                        className="absolute right-3 top-2 1350px:top-[6px] text-[16px] cursor-pointer text-gray-500"
                        onClick={() => setVisible1(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute right-3 top-2 1350px:top-[6px] text-[16px] cursor-pointer text-gray-500"
                        onClick={() => setVisible1(true)}
                      />
                    )}
                  </div>
                </div>
                <div
                  className="1024px:pt-[5px] pt-[10px] 768px:pl-[25px] pl-[5px] 1024px:w-[60%] 768px:w-[80%] w-[100%] 
                pb-[20px] 1280px:pb-[10px] 1350px:pb-[5px]"
                >
                  <label className="block font-[400] text-[#242424] text-[12px]">
                    Confirm Password :
                  </label>
                  <div className="mt-1 1024px:mt-0 relative w-full">
                    <input
                      type={visible2 ? "text" : "password"}
                      name="password2"
                      placeholder="Confirm new password***"
                      // value={password2}
                      // onChange={(e) => setPassword2(e.target.value)}
                      className="appearance-none block !w-[100%] px-3 py-2 1280px:py-[6px] border border-gray-300 rounded-md 
                  shadow-sm placeholder-gray-500 text-[10px]
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                    />
                    {server_error.password2 ? (
                      <p className="pt-[3px] font-[400] text-[10px] text-[red]">
                        {server_error.password2[0]}
                      </p>
                    ) : (
                      ""
                    )}
                    {visible2 ? (
                      <AiOutlineEye
                        className="absolute right-3 top-2 1350px:top-[6px] text-[16px] cursor-pointer text-gray-500"
                        onClick={() => setVisible2(false)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute right-3 top-2 1350px:top-[6px]  text-[16px] cursor-pointer text-gray-500"
                        onClick={() => setVisible2(true)}
                      />
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="768px:mt-[10px] 768px:mb-[10px] 768px:ml-[25px] ml-[5px] capitalize
                py-[6px] px-2 border bg-[rgb(128,128,128,0.3)] text-black
      text-[13px] font-[400] 1500px:w-[25%] 1024px:w-[30%] 768px:w-[35%] w-[55%] rounded-sm 1280px:w-[130px]"
                >
                  change password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AllOrders = ({orders}) => {
  return (
    <div className="1024px:pl-8 pl-0 pt-1 300px:w-[98%] 768px:pl-2 1024px:w-full">
       {!orders && !orders?.length && (
          <div className="1024px:pl-8 768px:pl-3 pl-1 pt-2">
          <div
            className="flex items-center 768px:gap-[10px] gap-[3px] rounded-sm 
                     shadow-sm shadow-[rgb(247,214,171,0.5)] 1024px:px-2 px-1 py-1 w-full 768px:w-[85%] 1024px:w-[73%]"
          >
            <RiErrorWarningLine className="text-[red] 768px:text-[30px] text-[18px] 1350px:text-[26px]" />
            <h4 className="text-[#242424] font-[400] text-[12px]">
              <span className="text-[orangered]">
                No order has been made yet.
              </span>
              <span className="hidden 768px:inline text-[12px] font-normal">
                {" "}
                Visit our shop and choice your best products.
              </span>
            </h4>
            <Link
              to={`/shop`}
              className="text-[13px]
                      font-[400] 768px:px-2 px-[5px] py-1 hover:underline text-black bg-transparent  
                      border-[1px] border-[rgb(128,128,128,0.4)] outline-none
                        rounded-sm ml-[3px] 768px:ml-0"
            >
              Visit shop
            </Link>
          </div>
          <div className="768px:w-[95%] w-[100%]  overflow-hidden">
            <img
              src={o2}
              alt=""
              className="w-full 768px:w-full 768px:h-[500px] 1350px:h-[350px] h-[280px] 768px:object-contain object-contain"
            />
          </div>
        </div>
       )}
        
       {orders && orders?.length && (
             <div className="300px:w-[calc(100vw-60px)] 768px:w-[calc(100vw-90px)] 1024px:w-full">
              <div className="300px:overflow-x-scroll no-scrollbar 1024px:overflow-hidden w-full">
             <table className="w-full table-auto border-collapse border border-gray-300">
               <thead>
                 <tr className="bg-gray-100">
                   <th className="border border-gray-300 px-4 py-2 text-[13px] font-normal text-[#242424]">Order Items</th>
                   <th className="border border-gray-300 px-4 py-2 text-[13px] font-normal text-[#242424]">Phone Number</th>
                   <th className="border border-gray-300 px-4 py-2 text-[13px] font-normal text-[#242424]">Shipping Address</th>
                   <th className="border border-gray-300 px-4 py-2 text-[13px] font-normal text-[#242424]">Total Price</th>
                   <th className="border border-gray-300 px-4 py-2 text-[13px] font-normal text-[#242424]">Payment Status</th>
                   <th className="border border-gray-300 px-4 py-2 text-[13px] font-normal text-[#242424]">Paid Amount</th>
                   <th className="border border-gray-300 px-4 py-2 text-[13px] font-normal text-[#242424]">Pending Amount</th>
                 </tr>
               </thead>
               <tbody>
                 {orders?.map((order) => (
                   <tr key={order.id} className="bg-white">
                     <td className="border border-gray-300 px-12 1024px:px-4 py-2 flex flex-col  items-center">
                       {order.order_items.map((item, index) => (
                         <div key={index} className="flex items-center mb-2 md:mb-0 md:mr-2">
                           <img
                             src={process.env.REACT_APP_IMG_URL+item.product.product_imgs[0].images}
                             alt={item.product.name}
                             className="w-10 h-10 object-cover rounded-md mr-2 mb-[5px]"
                           />
                           <span className="text-[10px] font-normal text-[#242424]">{item.product.name}</span>
                           <p className="flex items-center ml-[10px]">
                            <span className="text-[10px] font-normal text-[#242424]">Qty: 
                              <span>{item?.quantity}</span></span></p>
                         </div>
                       ))}
                     </td>
                     <td className="border border-gray-300 px-4 py-2 text-[12px] font-normal text-[#242424]">{order.shipping_address.phone}</td>
                     <td className="border border-gray-300 px-4 py-2 text-[12px] font-normal text-[#242424]">{order.shipping_address.address+','+ order.shipping_address.city}</td>
                     <td className="border border-gray-300 px-4 py-2 text-[12px] font-normal text-[#242424]">{order.total_price}</td>
                     <td className="border border-gray-300 px-4 py-2 text-[12px] font-normal text-[#242424]">{order.payment_status}</td>
                     <td className="border border-gray-300 px-4 py-2 text-[12px] font-normal text-[#242424]">{order.paid_amount}</td>
                     <td className="border border-gray-300 px-4 py-2 text-[12px] font-normal text-[#242424]">{order.after_partial_cod_remain_total_price}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
             </div>
           </div>
       )} 

    </div>
  );
};

export default ProfileContent;