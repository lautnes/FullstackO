// src/App.jsx
import './App.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import Display from './components/Display';
import Button from './components/Button';

const App = () => {
  const queryClient = useQueryClient();
  const { data: anecdotes, isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  });

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
    }
  });

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  if (isLoading) return <div className="container">Loading anecdotes...</div>;
  if (isError) return <div className="container">Error loading anecdotes</div>;

  return (
    <div className="container">
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteForm />


      <ul className="anecdote-list">
        {anecdotes.map(anecdote => (
          <li key={anecdote.id} className="anecdote-item">
            <span>
              {anecdote.content} <strong>votes: {anecdote.votes}</strong>
            </span>
            <button className="vote-button" onClick={() => handleVote(anecdote)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
