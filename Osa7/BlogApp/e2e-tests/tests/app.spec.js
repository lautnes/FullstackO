const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog App', () => {
  beforeEach(async ({ page, request }) => {
    // Reset and seed test data before each test
    await request.post('http://localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Matti Luukkainen', username: 'mluukkai', password: 'salainen' },
    });
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Other User', username: 'otheruser', password: 'otherpassword' },
    });
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="username"]').fill('mluukkai');
      await page.locator('input[name="password"]').fill('salainen');
      await page.getByRole('button', { name: /login/i }).click();
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="username"]').fill('mluukkai');
      await page.locator('input[name="password"]').fill('wrongpassword');
      await page.getByRole('button', { name: /login/i }).click();
      await expect(page.getByText('Invalid username or password')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('input[name="username"]').fill('mluukkai');
      await page.locator('input[name="password"]').fill('salainen');
      await page.getByRole('button', { name: /login/i }).click();
    });

    test('a new blog can be created', async ({ page }) => {
      // Create a new blog
      await page.getByRole('button', { name: /new blog/i }).click();
      await page.locator('input[name="title"]').fill('My First Blog');
      await page.locator('input[name="author"]').fill('Author Name');
      await page.locator('input[name="url"]').fill('http://myblog.com');
      await page.getByRole('button', { name: /create/i }).click();
    
      // Use the unique data-testid for the specific blog item
      await expect(page.getByTestId('blog-item-My-First-Blog')).toContainText('My First Blog');
    });
    

    test('Only the user who added the blog can see the delete button', async ({ page }) => {
      // Create a blog
      await page.getByRole('button', { name: /new blog/i }).click();
      await page.locator('input[name="title"]').fill('User-Specific Blog');
      await page.locator('input[name="author"]').fill('First Author');
      await page.locator('input[name="url"]').fill('http://userblog.com');
      await page.getByRole('button', { name: /create/i }).click();
      await page.locator('[data-testid="toggle-view"]').click();

      // Verify the delete button is visible for the blog creator
      await expect(page.locator('[data-testid="delete-button"]')).toBeVisible();

      // Log out and log in as a different user
      await page.getByRole('button', { name: /logout/i }).click();
      await page.locator('input[name="username"]').fill('otheruser');
      await page.locator('input[name="password"]').fill('otherpassword');
      await page.getByRole('button', { name: /login/i }).click();

      // Expand the blog entry and check that the delete button is not visible
      await page.locator('[data-testid="toggle-view"]').click();
      await expect(page.locator('[data-testid="delete-button"]')).not.toBeVisible();
    });

    test('Blogs are ordered by likes in descending order', async ({ page }) => {
      const blogs = [
        { title: 'Popular Blog', author: 'Popular Author', url: 'http://popular.com', likes: 5 },
        { title: 'Less Popular Blog', author: 'Less Popular', url: 'http://lesspopular.com', likes: 3 },
        { title: 'Least Popular Blog', author: 'Least Popular', url: 'http://leastpopular.com', likes: 1 },
      ];

      for (const blog of blogs) {
        await page.getByRole('button', { name: /new blog/i }).click();
        await page.locator('input[name="title"]').fill(blog.title);
        await page.locator('input[name="author"]').fill(blog.author);
        await page.locator('input[name="url"]').fill(blog.url);
        await page.getByRole('button', { name: /create/i }).click();
        await page.locator('[data-testid="toggle-view"]').click();
        for (let i = 0; i < blog.likes; i++) {
          await page.locator('[data-testid="like-button"]').click();
        }
      }

      const blogTitles = await page.$$eval('[data-testid="blog-item"]', (blogs) =>
        blogs.map((blog) => blog.textContent)
      );
      expect(blogTitles[0]).toContain('Popular Blog');
      expect(blogTitles[1]).toContain('Less Popular Blog');
      expect(blogTitles[2]).toContain('Least Popular Blog');
    });

    test('User can delete their own blog', async ({ page }) => {
      await page.getByRole('button', { name: /new blog/i }).click();
      await page.locator('input[name="title"]').fill('Deletable Blog');
      await page.locator('input[name="author"]').fill('Deletable Author');
      await page.locator('input[name="url"]').fill('http://deletableblog.com');
      await page.getByRole('button', { name: /create/i }).click();
      await page.locator('[data-testid="toggle-view"]').click();
      await page.locator('[data-testid="delete-button"]').click();
      await expect(page.locator('[data-testid="blog-item"]')).not.toContainText('Deletable Blog');
    });
  });
});
