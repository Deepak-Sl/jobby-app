import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>
      <ul className="link-container">
        <li>
          <Link to="/" className="link-item">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="link-item">
            Jobs
          </Link>
        </li>
      </ul>
      <li>
        <button type="button" className="logout-button" onClick={onClickLogout}>
          Logout
        </button>
      </li>
    </div>
  )
}

export default withRouter(Header)
