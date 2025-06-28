import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {Component} from 'react'
import Header from '../Header'
import JobItem from '../JobItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsList: [],
    searchInput: '',
    employmentType: [],
    salaryRange: '',
    locations: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {employmentType, salaryRange, searchInput, locations} = this.state

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const allJobs = data.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      const filteredJobs =
        locations.length === 0
          ? allJobs
          : allJobs.filter(job => locations.includes(job.location))

      this.setState({
        jobsList: filteredJobs,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const profileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeEmploymentType = event => {
    const {value, checked} = event.target
    this.setState(
      prevState => ({
        employmentType: checked
          ? [...prevState.employmentType, value]
          : prevState.employmentType.filter(item => item !== value),
      }),
      this.getJobs,
    )
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobs)
  }

  onChangeLocation = event => {
    const {value, checked} = event.target
    this.setState(
      prevState => ({
        locations: checked
          ? [...prevState.locations, value]
          : prevState.locations.filter(item => item !== value),
      }),
      this.getJobs,
    )
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  retryProfile = () => this.getProfileDetails()

  retryJobs = () => this.getJobs()

  renderProfileSection = () => {
    const {profileApiStatus, profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return (
          <div className="profile">
            <img alt="profile" src={profileImageUrl} />
            <h1 className="profile-name">{name}</h1>
            <p className="profile-bio">{shortBio}</p>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <button type="button" onClick={this.retryProfile}>
            Retry
          </button>
        )
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      default:
        return null
    }
  }

  renderJobsSection = () => {
    const {jobsApiStatus, jobsList} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return jobsList.length > 0 ? (
          <ul className="jobs-list">
            {jobsList.map(each => (
              <JobItem key={each.id} item={each} />
            ))}
          </ul>
        ) : (
          <div className="no-job-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters.</p>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div className="error-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for.</p>
            <button type="button" onClick={this.retryJobs}>
              Retry
            </button>
          </div>
        )
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const {employmentTypesList, salaryRangesList} = this.props
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-page-container">
          <div className="left sidebar-sticky">
            {this.renderProfileSection()}
            <hr />
            <h1 className="heading-jobs-page">Type of Employment</h1>
            <ul>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    value={each.employmentTypeId}
                    onChange={this.onChangeEmploymentType}
                  />
                  <label
                    className="input-label"
                    htmlFor={each.employmentTypeId}
                  >
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <h1 className="heading-jobs-page">Salary Range</h1>
            <ul>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="radio"
                    name="salary"
                    id={each.salaryRangeId}
                    value={each.salaryRangeId}
                    onChange={this.onChangeSalaryRange}
                  />
                  <label className="input-label" htmlFor={each.salaryRangeId}>
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <h1 className="heading-jobs-page">Location</h1>
            <ul>
              {['Hyderabad', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai'].map(
                location => (
                  <li key={location}>
                    <input
                      type="checkbox"
                      id={location}
                      value={location}
                      onChange={this.onChangeLocation}
                    />
                    <label className="input-label" htmlFor={location}>
                      {location}
                    </label>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="right">
            <div className="search-bar">
              <input
                type="search"
                className="search"
                onChange={this.onChangeSearch}
                value={searchInput}
                placeholder="Search"
              />
              <button
                type="button"
                onClick={this.getJobs}
                data-testid="searchButton"
                className="search-icon-button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsSection()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
