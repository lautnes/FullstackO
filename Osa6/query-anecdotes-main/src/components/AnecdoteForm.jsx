// src/components/AnecdoteForm.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../requests';
import { useNotification } from '../context/NotificationContext';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

  // Define mutation with success and error handlers
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      // Invalidate and refetch anecdotes
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
      dispatch({ type: 'SHOW', payload: 'Anecdote created successfully!' });
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000);
    },
    onError: () => {
      // Display error notification if anecdote is too short
      dispatch({ type: 'SHOW', payload: 'Anecdote content must be at least 5 characters long.' });
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000);
    }
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;

    // Check if content is valid before calling mutate
    if (content.length >= 5) {
      newAnecdoteMutation.mutate({ content, votes: 0 });
      event.target.anecdote.value = '';
    } else {
      // Directly dispatch error notification if anecdote is too short
      dispatch({ type: 'SHOW', payload: 'Anecdote content must be at least 5 characters long.' });
      setTimeout(() => dispatch({ type: 'HIDE' }), 5000);
    }
  };

  return (
    <form onSubmit={onCreate}>
      <input name="anecdote" placeholder="Enter your anecdote" />
      <button type="submit">Create Anecdote</button>
    </form>
  );
};

export default AnecdoteForm;
