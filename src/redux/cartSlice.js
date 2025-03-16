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
        
      } else {
        state.items.push({ ...action.payload, oneQtyPrice: action.payload.price, quantity: 1 });
      }
      // ✅ Show Toast Notification
      toast.success(`${action.payload.title} added to cart!`);
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(
        (p) => p.id !== action.payload.id
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    updateCart: (state, action) => {
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
