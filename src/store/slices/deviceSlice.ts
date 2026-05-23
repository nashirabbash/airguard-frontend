import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface DeviceState {
  selectedDeviceId: string | null;
}

const initialState: DeviceState = {
  selectedDeviceId: sessionStorage.getItem('airguard_selected_device'),
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setSelectedDeviceId: (state, action: PayloadAction<string | null>) => {
      state.selectedDeviceId = action.payload;
      if (action.payload) {
        sessionStorage.setItem('airguard_selected_device', action.payload);
      } else {
        sessionStorage.removeItem('airguard_selected_device');
      }
    },
    clearSelectedDevice: (state) => {
      state.selectedDeviceId = null;
      sessionStorage.removeItem('airguard_selected_device');
    },
  },
});

export const { setSelectedDeviceId, clearSelectedDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
