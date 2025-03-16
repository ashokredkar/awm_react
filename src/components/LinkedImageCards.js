import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';

const LinkedImageCards = ({ dataArray }) => {

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const totalImages = dataArray.length;
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount += 1;

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