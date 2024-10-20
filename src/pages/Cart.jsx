import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { removeItem } from '../redux/cartSlice';

const Cart = () => {

    const cartItems = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const handleRemove = (productId) => {
        dispatch(removeItem(productId));
    }

    const [qtyValue, setQtyValue] = useState(1);
    const min = 1;
    const max = 10;
    const handleQtyChange =  (e) => {
        setQtyValue(Math.max(min, Math.min(max, Number(e.target.value))));
    }

    if(cartItems.length <= 0){
        return (
            <div className='cart_empty container'>
                <h2>No products added!</h2>
                <button className='custom_btn'>View Products</button>
            </div>
        )
    }

    return (
        <div className='cart_items container'>
            {cartItems.map((item) => (
                <div className="single_cart_item" key={item.prodID}>
                    <img src={item.prodImage} alt={item.title} width={"20px"} />
                    <h4>{item.title}</h4>
                    <div className="qnty">
                        <input type="number" min="1" max="10" placeholder='1' />
                    </div>
                    <button className='custom_btn'  onClick={() => handleRemove(item.prodID)}>Remove</button>
                </div>
            ))}
        </div>
    )
}

export default Cart