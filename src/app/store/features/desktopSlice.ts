import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const desktopSlice = createSlice({
  name: 'desktop',
  initialState: {
    activeApp: '',
    focusApp: '',
    fullScreen: false,
    showAppMenu: false,
   },
  reducers: {
    setActiveApp: (state, action: PayloadAction<string>) => {
      state.activeApp = action.payload;
    },
    setFoucsApp: (state, action: PayloadAction<string>) => {
      state.focusApp = action.payload;
    },
    setFullScreen: (state, action: PayloadAction<boolean>) => {
      state.fullScreen = action.payload;
    },
    setShowAppMenu: (state, action: PayloadAction<boolean>) => {
      state.showAppMenu = action.payload;
    },
  },
});

export const { setActiveApp, setFoucsApp, setFullScreen, setShowAppMenu } = desktopSlice.actions;
export default desktopSlice.reducer;