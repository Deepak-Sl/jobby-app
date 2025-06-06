import './index.css'
import {IoLocation, IoBagHandle, IoStar} from 'react-icons/io5'
import {Link} from 'react-router-dom'

const JobItem = props => {
  const {item} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = item
  return (
    <li className="job-item-card">
      <Link to={`jobs/${id}`} className="link-element">
        <div className="item-header">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="company-role">{title}</h1>
            <div className="rating">
              <IoStar className="star" />
              <p className="rat">{rating}</p>
            </div>
          </div>
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
        <div>
          <h1 className="description-heading">Description</h1>
        </div>

        <p className="description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
