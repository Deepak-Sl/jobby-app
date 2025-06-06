import './index.css'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Header from '../Header'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <div className="home-page-container">
        <Header />
        <div className="home-page-below">
          <div className="home-page-text-container">
            <h1 className="home-page-heading">
              Find The Job That Fits Your Life
            </h1>
            <p className="home-page-description">
              Millions of people are searching for jobs, salary information,
              company reviews. Find the jobs that fits your abilities and
              potential.
            </p>
            <Link to="/jobs">
              <button type="button" className="find-jobs-button">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
