import './App.css'
import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import NotFound from './components/NotFound'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'
import ProtectedRoute from './components/ProtectedRoute'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
console.log(employmentTypesList, salaryRangesList)

// Replace your code here
const App = () => (
  <>
    <Switch>
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute
        exact
        path="/jobs"
        render={props => (
          <Jobs
            {...props}
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
          />
        )}
      />
      <ProtectedRoute path="/jobs/:id" component={JobItemDetails} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/not-found" component={NotFound} />
      <Redirect to="not-found" />
    </Switch>
  </>
)
export default App
