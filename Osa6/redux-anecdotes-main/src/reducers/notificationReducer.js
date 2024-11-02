import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '', // Start with no notification
  reducers: {
    setNotification(state, action) {
      return action.payload // Set notification message
    },
    clearNotification() {
      return '' // Clear notification message
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
