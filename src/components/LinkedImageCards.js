import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { LazyLoadImage } from "react-lazy-load-image-component";

// const LinkedImageCards = ({ dataArray, imagesArray, setProductPageInfo }) => {
const LinkedImageCards = ({ dataArray }) => {

  // const [loading, setLoading] = useState(true);
  // const setLoader = () => {
  //   dataArray ? setLoading(false) : setLoading(true);
  // }
  // useEffect(() => {
  //   // setTimeout(() => {
  //     setLoader();
      
  //   // }, 3000);
  // }, [loading]);

  return (
    

    <div className="featured_items_container">
      { dataArray?.map((item, i) => (
        // <Link to={item.link} key={i} className='single_item' id={item.id} onClick={()=>setProductPageInfo(item.productPageInfo)}>
        <Link to={item.link} key={i} className='single_item' id={item.id}>
            {/* {loading ? (<h4>Loading</h4>) : <img src={item.img} alt="featured_beverage" />} */}
            <img src={item.img} alt="featured_beverage" />
        </Link>
      ))}
    </div>
  )
}

export default LinkedImageCards