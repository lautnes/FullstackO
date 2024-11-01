const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

// Action types
const VOTE_ANECDOTE = 'VOTE_ANECDOTE'
const ADD_ANECDOTE = 'ADD_ANECDOTE'

// Action creators
export const voteAnecdote = (id) => {
  return {
    type: VOTE_ANECDOTE,
    data: { id }
  }
}

export const addAnecdote = (content) => {
  return {
    type: ADD_ANECDOTE,
    data: {
      content,
      id: getId(),
      votes: 0
    }
  }
}

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case VOTE_ANECDOTE:
      return state
        .map(anecdote => 
          anecdote.id === action.data.id
            ? { ...anecdote, votes: anecdote.votes + 1 }
            : anecdote
        )
        .sort((a, b) => b.votes - a.votes)
        
    case ADD_ANECDOTE:
      return [...state, action.data].sort((a, b) => b.votes - a.votes)
    
    default:
      return state
  }
}

export default reducer
