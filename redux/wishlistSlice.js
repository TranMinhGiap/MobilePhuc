import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    toggleWishlist: (state, action) => {
      const { userId, productId } = action.payload;
      const existingItem = state.items.find(
        (item) => item.userId === userId && item.productId === productId
      );
      if (existingItem) {
        state.items = state.items.filter(
          (item) => !(item.userId === userId && item.productId === productId)
        );
      } else {
        state.items.push({ userId, productId });
      }
    },
  },
});

export const { setWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;