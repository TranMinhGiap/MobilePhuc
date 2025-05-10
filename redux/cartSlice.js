import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      const { userId, productId, size, color, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.userId === userId && item.productId === productId && item.size === size && item.color === color
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ userId, productId, size, color, quantity });
      }
    },
    updateCartItem: (state, action) => {
      const { userId, productId, oldSize, oldColor, size, color, quantity } = action.payload;
      
      // Xóa mục cũ nếu size hoặc color thay đổi
      if (oldSize !== size || oldColor !== color) {
        state.items = state.items.filter(
          (item) => !(item.userId === userId && item.productId === productId && item.size === oldSize && item.color === oldColor)
        );
        // Thêm mục mới với size, color và quantity mới
        state.items.push({ userId, productId, size, color, quantity });
      } else {
        // Nếu size và color không thay đổi, chỉ cập nhật quantity
        const item = state.items.find(
          (item) => item.userId === userId && item.productId === productId && item.size === size && item.color === color
        );
        if (item) {
          item.quantity = quantity;
        }
      }
    },
    removeFromCart: (state, action) => {
      const { userId, productId, size, color } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.userId === userId && item.productId === productId && item.size === size && item.color === color)
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, addToCart, updateCartItem, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;