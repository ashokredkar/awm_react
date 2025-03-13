import { updateCart, removeItem } from "../redux/cartSlice";
import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

const CartItem = ({ item }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const currentItem = cartItems.find(i => i.id === item.id);
    const updateCartItem = (e, key) => {
        let payload= {
            key,
            // val: key === "quantity" ? parseInt(e.target.value) : e.target.value,  // here "val" can be quantity or selectedSize, so making sure if val is quantity then it has to be integer/number
            val: parseInt(e.target.value),
            id: item.id
        }
        dispatch(updateCart(payload));
    }
    console.log("item", item);
    

    return (
        <div className="cart_item">
            <div className="prod_thumbnail"><img src={`..${item.thumbnail}`} alt={item.title} /></div>

            <div className="item_info">
                <div className="flex flex-col md:flex-row justify-between">
                    <div>
                        <h2>{item.title}</h2>
                        <span>{item.category}</span>
                    </div>
                    <p>MRP : &#8377;{item.price}</p> 
                </div>

                <div className="item_footer">
                    {/* <div className="flex items-center gap-1">
                        <div className="font-semibold">Size:</div>
                        <select className="hover:text-black" onChange={(e) => updateCartItem(e, "selectedSize")}>
                            {item?.size.data.map((sizeItem, i) => {
                                return (
                                    <option key={i} value={sizeItem.size} disabled={!sizeItem.enabled?true:false} selected={item.selectedSize === sizeItem.size}>{sizeItem.size}</option>
                                )
                            })}
                        </select>
                    </div> */}

                    <div className="item_quantity">
                        <span>Quantity:</span>
                        <select className="hover:text-black" onChange={(e) => updateCartItem(e, "quantity")} defaultValue={currentItem.quantity}>
                        {Array.from({length: 10}, (_, i) => i+1).map((qty, i) => {
                            return (
                                    <option key={i} value={qty}>{qty}</option>
                                )
                            })}
                        </select>
                    </div>
                    <RiDeleteBin6Line onClick={() => dispatch(removeItem({id: item.id}))} />
                </div>
            </div>
        </div>
    );
};

export default CartItem;