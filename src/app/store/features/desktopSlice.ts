import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const desktopSlice = createSlice({
  name: 'desktop',
  initialState: {
    activeApp: '',
    focusApp: '',
   },
  reducers: {
    setActiveApp: (state, action: PayloadAction<string>) => {
      state.activeApp = action.payload;
    },
    setFoucsApp: (state, action: PayloadAction<string>) => {
      state.focusApp = action.payload;
    }
  },
});

export const { setActiveApp, setFoucsApp } = desktopSlice.actions;
export default desktopSlice.reducer;