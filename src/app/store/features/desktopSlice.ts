import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const desktopSlice = createSlice({
  name: 'desktop',
  initialState: { activeApp: '' },
  reducers: {
    setActiveApp: (state, action: PayloadAction<string>) => {
      state.activeApp = action.payload;
    },
  },
});

export const { setActiveApp } = desktopSlice.actions;
export default desktopSlice.reducer;