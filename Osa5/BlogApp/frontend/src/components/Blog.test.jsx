import { render, screen, fireEvent } from '@testing-library/react';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

test('renders title and author, but not URL or likes by default', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10,
    user: { username: 'testuser' },
  };

  render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} />);

  // Check for title and author
  expect(screen.getByText(/Test Blog Title/i)).toBeInTheDocument();
  expect(screen.getByText(/Test Author/i)).toBeInTheDocument();

  // Check that URL and likes are not rendered
  expect(screen.queryByText(/http:\/\/example.com/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Likes: 10/i)).not.toBeInTheDocument();
});

test('renders URL, likes, and user after clicking view', async () => {
    const blog = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 10,
      user: { username: 'testuser', name: 'Test User' }, // Add name to the user object
    };
  
    render(<Blog blog={blog} user={{ username: 'testuser' }} onLike={() => {}} onDelete={() => {}} />);
  
    // Initially, URL and likes are not displayed
    expect(screen.queryByText(/http:\/\/example.com/i)).not.toBeInTheDocument();
    
    // Click the view button
    fireEvent.click(screen.getByText('view'));
  
    // Now URL, likes, and user should be displayed
    expect(screen.getByText(/http:\/\/example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Likes: 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Added by: Test User/i)).toBeInTheDocument(); // Adjust to check for the full name if you are using it
});
  

test('clicking like button twice calls event handler twice', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 10,
    user: { username: 'testuser' },
  };

  const mockLikeHandler = vi.fn(); // Use vi.fn() for Vitest

  render(<Blog blog={blog} user={{ username: 'testuser' }} onLike={mockLikeHandler} onDelete={() => {}} />);

  // Expand the blog to reveal the like button
  fireEvent.click(screen.getByText('view'));

  // Click like button twice
  fireEvent.click(screen.getByText('like'));
  fireEvent.click(screen.getByText('like'));

  expect(mockLikeHandler).toHaveBeenCalledTimes(2);
});
