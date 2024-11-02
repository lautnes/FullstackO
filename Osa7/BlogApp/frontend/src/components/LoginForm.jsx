import PropTypes from 'prop-types';

const LoginForm = ({ handleSubmit, handleUsernameChange, handlePasswordChange, username, password }) => (
  <div className="login-form">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          className="input-field"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
          aria-label="username"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="input-field"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
          aria-label="password"
        />
      </div>
      <button type="submit" className="submit-button">Login</button>
    </form>
  </div>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginForm;
