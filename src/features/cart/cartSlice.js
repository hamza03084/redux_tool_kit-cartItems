import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import data from "../../cartItems";
import axios from "axios";
import { openModal } from "../modal/modalSlice";

const url = "https://course-api.com/react-useReducer-cart-project";

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (name, thunkAPI) => {
    try {
      // console.log(name);
      // console.log(thunkAPI);
      // console.log(thunkAPI.getState());
      // thunkAPI.dispatch(openModal());
      const resp = await axios.get(url);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);
const initialState = {
  cartItems: [],
  amount: 4,
  total: 0,
  isLoading: true,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, { payload }) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== payload);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload);
      cartItem.amount = cartItem.amount + 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload);
      cartItem.amount = cartItem.amount - 1;
    },
    calculateTotals: (state) => {
      let totalAmount = 0;
      let totalPrice = 0;

      state.cartItems.map((item) => {
        totalAmount += item.amount;
        totalPrice += item.amount * item.price;
      });
      state.amount = totalAmount;
      state.total = totalPrice;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state, { payload }) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, { payload }) => {
        state.cartItems = payload;
        state.isLoading = false;
      })
      .addCase(getCartItems.rejected, (state, { payload }) => {
        state.isLoading = true;
      });
  },
});
export const { clearCart, removeItem, increase, decrease, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
