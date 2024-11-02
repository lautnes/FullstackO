import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector((state) => state.anecdotes)
  const filter = useSelector((state) => state.filter)

  const filteredAnecdotes = filter
    ? anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      )
    : anecdotes

  const handleVote = (id) => {
    const votedAnecdote = anecdotes.find((a) => a.id === id)
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`You voted '${votedAnecdote.content}'`))
    
    // Clear notification after 5 seconds
    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  return (
    <div>
      {filteredAnecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} onVote={handleVote} />
      ))}
    </div>
  )
}

const Anecdote = ({ anecdote, onVote }) => (
  <div style={{ marginBottom: '1em' }}>
    <div>{anecdote.content}</div>
    <div>
      has {anecdote.votes} votes
      <button onClick={() => onVote(anecdote.id)} style={{ marginLeft: '0.5em' }}>
        vote
      </button>
    </div>
  </div>
)

export default AnecdoteList
