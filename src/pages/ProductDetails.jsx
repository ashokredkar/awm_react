import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SwiperButtons from "../components/SwiperButtons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addItem } from "../redux/cartSlice";

const ProductDetails = () => {

  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const handleCart = (currentViewedDetails) => {
    const productPrice =
      currentData?.productPageInfo?.products.find(
        (p) => p.viewedDetails?.prodID === currentViewedDetails?.prodID
      )?.productPrice || "0";

    dispatch(
      addItem({
        ...currentViewedDetails,
        id: currentViewedDetails.prodID || `product-${Date.now()}`,
        price: productPrice,
        title: currentViewedDetails.title,
      })
    );
    setIsAddedToCart(true);
  };

  const [sliderViewNumber, setSliderViewNumber] = useState(4);
  useEffect(() => {
    if (window.innerWidth < 480) {
      setSliderViewNumber(1);
    } else if (window.innerWidth < 767) {
      setSliderViewNumber(2);
    } else if (window.innerWidth < 1400) {
      setSliderViewNumber(3);
    } else {
      return;
    }
  }, []);

  const allData = useSelector((state) => state.products.productsData);
  const [currentData, setCurrentData] = useState({});
  const [currentViewedDetails, setCurrentViewedDetails] = useState({});
  const [sliderProducts, setSliderProducts] = useState([]);
  const [sliderItemClicked, setSliderItemClicked] = useState(false);

  useEffect(() => {
    const currentPageHref = window.location.href;
    const currentProdId = currentPageHref.split("/").at(6) - 1;
    if (currentPageHref.includes("wines")) {
      if (currentPageHref.includes("betheone")) {
        setCurrentData(
          allData.filter((dataItem) => dataItem.target === "wines").at(0)
        );
      } else if (currentPageHref.includes("dudies")) {
        setCurrentData(
          allData.filter((dataItem) => dataItem.target === "wines").at(1)
        );
      } else if (currentPageHref.includes("mayan3")) {
        setCurrentData(
          allData.filter((dataItem) => dataItem.target === "wines").at(2)
        );
      } else if (currentPageHref.includes("magic")) {
        setCurrentData(
          allData.filter((dataItem) => dataItem.target === "wines").at(3)
        );
      } else if (currentPageHref.includes("fsol")) {
        setCurrentData(
          allData.filter((dataItem) => dataItem.target === "wines").at(4)
        );
        // }else if(currentPageHref.includes("luigi_bosca")){
        //     setCurrentData(allData.filter(dataItem => dataItem.target === "wines").at(5));
      } else if (currentPageHref.includes("mayan6")) {
        setCurrentData(
          allData.filter((dataItem) => dataItem.target === "wines").at(5)
        );
      } else {
        setCurrentData(
          allData.filter((dataItem) => dataItem.target === "wines").at(6)
        );
      }
    } else if (currentPageHref.includes("whiskys")) {
      if (currentPageHref.includes("betheone_whisky")) {
        setCurrentData(
          allData.filter((dataItem) => dataItem.target === "whiskys").at(1)
        );
      } else {
        setCurrentData(
          allData.filter((dataItem) => dataItem.target === "whiskys").at(0)
        );
      }
    } else {
      if (currentPageHref.includes("summerof88")) {
        setCurrentData(
          allData
            .filter((dataItem) => dataItem.target === "non-alcoholic")
            .at(0)
        );
      } else if (currentPageHref.includes("springof88")) {
        setCurrentData(
          allData
            .filter((dataItem) => dataItem.target === "non-alcoholic")
            .at(1)
        );
      } else {
        setCurrentData(
          allData
            .filter((dataItem) => dataItem.target === "non-alcoholic")
            .at(2)
        );
      }
    }
    const viewedDetails =
      currentData?.productPageInfo?.products.at(currentProdId).viewedDetails;
    // Add a unique identifier if it doesn't exist
    if (viewedDetails) {
      setCurrentViewedDetails({
        ...viewedDetails,
        id: viewedDetails.id || `${currentData?.target}-${currentProdId}`, // Create unique ID
      });
    }
    setSliderProducts(
      currentData?.productPageInfo?.products.filter((product) => 
        product.linkName !== currentData?.productPageInfo?.products.at(currentProdId).viewedDetails.title &&
        product.productName !== currentData?.productPageInfo?.products.at(currentProdId).viewedDetails.title
      )
    );
  }, [currentData, allData, sliderItemClicked]);

  return (
    <div className="product_page">
      <PageHeader header_img={currentViewedDetails?.prodHeader} />
      <div className="viewed_product section_padding">
        <div className="breadcrumb_div">
          <nav aria-label="breadcrumb" className="container">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to={`/${currentData?.productPageInfo?.mainLinkhref}`}>
                  {currentData?.productPageInfo?.mainLink}
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {currentViewedDetails?.title}
              </li>
            </ol>
          </nav>
        </div>
        <div className="container">
          <div className="product_info">
            <h4>{currentViewedDetails?.title}</h4>
            {currentViewedDetails?.subInfo && (
              <h5>{currentViewedDetails?.subInfo}</h5>
            )}
            <p>{currentViewedDetails?.desc}</p>
            <div className="more_details">
              <p>
                <span>Region:</span> {currentViewedDetails?.region}
              </p>
              {currentViewedDetails?.variety && (
                <p>
                  <span>Grape Variety:</span> {currentViewedDetails?.variety}
                </p>
              )}
              {/* {currentViewedDetails?.wine_style && <p><span>Wine Style:</span> {currentViewedDetails?.wine_style}</p>} */}
              {/* {currentViewedDetails?.vintage && <p><span>Vintage:</span> {currentViewedDetails?.vintage}</p>} */}
              <p>
                <span>Alcohol:</span> {currentViewedDetails?.alcohol}
              </p>
              <p>
                <span>Volume:</span> {currentViewedDetails?.volume}
              </p>
              <p>
                <span>Price:</span>{" "}
                {currentData?.productPageInfo?.products.find(
                  (p) =>
                    p.viewedDetails?.prodID === currentViewedDetails?.prodID
                )?.productPrice || "N/A"}
              </p>
              {isAddedToCart ? (
                <Link className="custom_btn mt-3 d-inline-block" to="/cart">
                  Go to cart
                </Link>
              ) : (
                <button
                  className="custom_btn mt-3"
                  onClick={() => handleCart(currentViewedDetails)}
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>
          <div className="viewed_img">
            <img src={currentViewedDetails?.prodImage} alt="product" />
          </div>
        </div>
      </div>
      {sliderProducts?.length >= 2 ? (
        <div className="recommended_products container">
          <h3>YOU MAY ALSO LIKE</h3>
          <div className="products_container">
            <Swiper
              spaceBetween={30}
              navigation
              slidesPerView={sliderViewNumber}
            >
              {sliderProducts?.map((product, i) => (
                <SwiperSlide key={i}>
                  <ProductCard product={product} sliderItemClicked={sliderItemClicked} setSliderItemClicked={setSliderItemClicked} />
                </SwiperSlide>
              ))}
              <SwiperButtons />
            </Swiper>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductDetails;
