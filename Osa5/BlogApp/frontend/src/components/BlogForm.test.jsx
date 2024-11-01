import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('calls createBlog with correct data when a new blog is created', async () => {
  const createBlog = vi.fn(); // Use vi.fn() for Vitest

  render(<BlogForm createBlog={createBlog} />); // Render the BlogForm

  // Get the inputs by their associated labels
  const titleInput = screen.getByLabelText(/title/i);
  const authorInput = screen.getByLabelText(/author/i);
  const urlInput = screen.getByLabelText(/url/i);
  const submitButton = screen.getByText('Create'); // Update to match the button text

  // Fill in the form fields
  await userEvent.type(titleInput, 'New Blog Title');
  await userEvent.type(authorInput, 'New Blog Author');
  await userEvent.type(urlInput, 'http://newblog.com');
  await userEvent.click(submitButton);

  // Assert that createBlog was called with the correct data
  expect(createBlog).toHaveBeenCalledWith({
    title: 'New Blog Title',
    author: 'New Blog Author',
    url: 'http://newblog.com',
  });
});
