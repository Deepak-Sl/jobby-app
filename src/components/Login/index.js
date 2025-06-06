import './index.css'
import Cookies from 'js-cookie'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {username: '', password: '', showError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onLoginFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page-container">
        <form className="login-form" onSubmit={this.onSubmitLoginForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-page-logo"
          />
          <div className="input-container">
            <label htmlFor="username" className="label-el">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              className="input"
              placeholder="Username"
              value={username}
              onChange={this.onChangeUsername}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password" className="label-el">
              PASSWORD
            </label>
            <input
              value={password}
              id="password"
              type="password"
              className="input"
              placeholder="Password"
              onChange={this.onChangePassword}
            />
            {showError && <p className="error-msg">{errorMsg}</p>}
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
