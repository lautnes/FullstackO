import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addNewAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    await dispatch(createAnecdote(content))
    dispatch(showNotification(`Added new anecdote: '${content}'`, 5)) // Set notification for 5 seconds
  }

  return (
    <form onSubmit={addNewAnecdote} style={{ marginTop: '20px' }}>
      <h3>Create a new anecdote</h3>
      <input name="anecdote" style={{ marginRight: '10px' }} />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
