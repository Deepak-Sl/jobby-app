import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocation, IoBagHandle} from 'react-icons/io5'
import SimilarJobs from '../SimilarJobs'
import Header from '../Header'

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    isLoading: true,
    isRequestFailed: false,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      const similarJobs = data.similar_jobs
      const jobDetails = data.job_details

      const updatedData = {
        companyLogoUrl: jobDetails.company_logo_url,
        title: jobDetails.title,
        rating: jobDetails.rating,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        skills: jobDetails.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },
      }

      const updatedSimilarJobs = similarJobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      console.log(updatedData)

      this.setState({
        jobDetails: updatedData,
        similarJobs: updatedSimilarJobs,
        isLoading: false,
      })
    } else {
      this.setState({isRequestFailed: true, isLoading: false})
    }
  }

  render() {
    const {jobDetails, similarJobs, isLoading, isRequestFailed} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      title,
      rating,
      packagePerAnnum,
      location,
    } = jobDetails
    console.log(isRequestFailed)
    return (
      <>
        <Header />
        {isLoading ? (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        ) : (
          <>
            {isRequestFailed ? (
              <div className="failure-view">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                  alt="failure view"
                />
                <h1>Oops! Something Went Wrong</h1>
                <p>We cannot seem to find the page you are looking for.</p>
                <button type="button" onClick={this.getJobDetails}>
                  Retry
                </button>
              </div>
            ) : (
              <div className="job-item-details-card">
                <div className="item-header">
                  <img
                    src={companyLogoUrl}
                    alt="job details company logo"
                    className="company-logo"
                  />
                  <h1>{title}</h1>
                  <p>{rating}</p>
                </div>
                <div className="line">
                  <div className="loc-tit">
                    <IoLocation />
                    <p>{location}</p>
                    <IoBagHandle />
                    <p>{employmentType}</p>
                  </div>
                  <p>{packagePerAnnum}</p>
                </div>
                <hr />
                <div className="row">
                  <h1 className="description-heading">Description</h1>
                  <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
                    Visit
                    <FaExternalLinkAlt />
                  </a>
                </div>
                <p className="description">{jobDescription}</p>
                <h1 className="description-heading">Skills</h1>
                <ul className="skills">
                  {skills.map(each => (
                    <div key={each.name}>
                      <img src={each.imageUrl} alt={each.name} />
                      <p>{each.name}</p>
                    </div>
                  ))}
                </ul>
                <h1 className="description-heading">Life at Company</h1>
                <ul>
                  <li className="row">
                    <p className="description">{lifeAtCompany.description}</p>
                    <img src={lifeAtCompany.imageUrl} alt="life at company" />
                  </li>
                </ul>
                <h1 className="description-heading">similar Jobs</h1>
                <ul>
                  {similarJobs.map(each => (
                    <SimilarJobs item={each} key={each.id} />
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </>
    )
  }
}
export default JobItemDetails
