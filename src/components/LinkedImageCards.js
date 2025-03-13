import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from './Loader';
// import { LazyLoadImage } from "react-lazy-load-image-component";

// const LinkedImageCards = ({ dataArray, imagesArray, setProductPageInfo }) => {
const LinkedImageCards = ({ dataArray }) => {

  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);

  useEffect(() => {
    const totalImages = dataArray.length;
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount += 1;
      setLoadedImages(loadedCount);

      if (loadedCount === totalImages) {
        setLoading(false);
      }
    };

    dataArray.forEach(item => {
      const img = new Image();
      img.src = item.img;
      img.onload = handleImageLoad;
    });

    // Cleanup function to avoid memory leaks
    return () => {
      setLoadedImages(0);
      setLoading(true);
    };
  }, [dataArray]);

  if (loading) {
    return <Loader />;
  }

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