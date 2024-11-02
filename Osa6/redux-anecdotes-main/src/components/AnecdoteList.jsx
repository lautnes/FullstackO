import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  
  const anecdotes = useSelector((state) => state.anecdotes)
  const filter = useSelector((state) => state.filter)

  // Filter anecdotes based on the filter state
  const filteredAnecdotes = filter
    ? anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      )
    : anecdotes

  const handleVote = (id) => {
    dispatch(voteAnecdote(id))
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
