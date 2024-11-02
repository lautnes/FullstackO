import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const createNew = async (content) => {
  const newAnecdote = { content, votes: 0 }
  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

export const update = async (id, updatedAnecdote) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
  return response.data
}
