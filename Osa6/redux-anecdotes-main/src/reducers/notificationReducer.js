// notificationReducer.js
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

// Enhanced action creator to set a notification with auto-clear
export const showNotification = (message, duration) => (dispatch) => {
  dispatch(setNotification(message))

  setTimeout(() => {
    dispatch(clearNotification())
  }, duration * 3000) // Convert seconds to milliseconds
}

export default notificationSlice.reducer
