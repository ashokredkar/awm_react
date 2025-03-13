import { createSlice, current } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Load cart from localStorage
// const loadCartFromStorage = () => {
//   if (typeof window !== "undefined") {
//     const storedCart = localStorage.getItem("cartItems");
//     return storedCart ? JSON.parse(storedCart) : [];
//   }
//   return [];
// };

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cartItems")) || [],
  },
  reducers: {
    addItem: (state, action) => {
      
      const presentItem = state.items.find(
        (p) => p.id === action.payload.id
      );
      if (presentItem) {
        presentItem.quantity++;
        presentItem.price = presentItem.quantity * presentItem.oneQtyPrice;
        console.log("R", current(presentItem));
        
      } else {
        state.items.push({ ...action.payload, oneQtyPrice: action.payload.price, quantity: 1 });
      }
      // ✅ Show Toast Notification
      toast.success(`${action.payload.title} added to cart!`);
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
      console.log("ADDED", current(state.items));
    },

    removeItem: (state, action) => {
      console.log("REMOVED");
      
      state.items = state.items.filter(
        (p) => p.id !== action.payload.id
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    updateCart: (state, action) => {
      console.log("UPDATED", action.payload);
      
      state.items = state.items.map((p) => {
        if (p.id === action.payload.id) {
          if (action.payload.key === "quantity") {
            p.price = p.oneQtyPrice * action.payload.val;
          }
          return { ...p, [action.payload.key]: action.payload.val };
        }
        return p;
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    emptyCart: (state, action) => {
      console.log("EMPTIED");
      
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("cartItems");
      }
    },

    setCartFromStorage: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, updateCart, emptyCart, setCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;
