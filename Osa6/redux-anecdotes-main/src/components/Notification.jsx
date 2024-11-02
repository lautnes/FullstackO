import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification) return null

  return (
    <div style={{ border: '1px solid', padding: '10px', marginBottom: '15px' }}>
      {notification}
    </div>
  )
}

export default Notification
