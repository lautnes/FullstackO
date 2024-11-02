import { useSelector, useDispatch } from 'react-redux'
import { updateVoteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector((state) => state.anecdotes)

  const handleVote = (anecdote) => {
    dispatch(updateVoteAnecdote(anecdote.id))
    dispatch(showNotification(`You voted for '${anecdote.content}'`, 5)) // Show notification for 5 seconds
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id} style={{ marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold' }}>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => handleVote(anecdote)} style={{ marginLeft: '10px' }}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
