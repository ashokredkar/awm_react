import { createSlice } from "@reduxjs/toolkit";

const getLocalCartData = () => {
    let localCartData = localStorage.getItem("AWM Cart");
    if(localCartData === []){
        return [];
    }else{
        return JSON.parse(localCartData);
    }
}

const cartSlice = createSlice({
    name: "cart",
    // initialState: [],
    initialState: getLocalCartData(),
    reducers: {
        addItem(state, action){
            if(state.find(item => item.prodID === action.payload.prodID)){
                alert("Product is already added in the cart, visit the cart to change the quantity");
            }else{
                state.push(action.payload);             // manipulating state, feature of createSlice method but is a bad practice in normal Redux
                localStorage.setItem("AWM Cart", JSON.stringify(state))
            }
        },
        removeItem(state, action){
            const filteredCart = state.filter(stateItem => stateItem.prodID !== action.payload);
            localStorage.setItem("AWM Cart", JSON.stringify(filteredCart));
            return filteredCart;
        }
    }
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;  



// PENDING
// After removing item, save to localStorage  -DONE
// duplicate items added   --- added alert for now
// quantity MdFormatIndentIncrease, cart total section