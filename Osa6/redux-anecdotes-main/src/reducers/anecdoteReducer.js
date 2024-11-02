import { createSlice } from '@reduxjs/toolkit'
import { getAll, createNew, update } from '../services/anecdotes'

// Set initial state to an empty array
const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
      state.sort((a, b) => b.votes - a.votes) // Sort anecdotes by votes
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdote = state.find((anecdote) => anecdote.id === id)
      if (anecdote) {
        anecdote.votes += 1
      }
      state.sort((a, b) => b.votes - a.votes) // Sort anecdotes by votes after voting
    }
  }
})

// Export synchronous actions
export const { setAnecdotes, appendAnecdote, voteAnecdote } = anecdoteSlice.actions

// Asynchronous thunk action to fetch anecdotes from the backend
export const initializeAnecdotes = () => async (dispatch) => {
  const anecdotes = await getAll() // Use getAll directly
  dispatch(setAnecdotes(anecdotes))
}

// Asynchronous thunk action to add a new anecdote to the backend
export const createAnecdote = (content) => async (dispatch) => {
  const newAnecdote = await createNew(content) // Use createNew directly
  dispatch(appendAnecdote(newAnecdote))
}

// Asynchronous thunk action to update vote count in the backend
export const updateVoteAnecdote = (id) => async (dispatch, getState) => {
  const anecdote = getState().anecdotes.find((a) => a.id === id)
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  const response = await update(id, updatedAnecdote) // Use update directly
  dispatch(voteAnecdote(response.id))
}

export default anecdoteSlice.reducer
