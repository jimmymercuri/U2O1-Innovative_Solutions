// routes page, 
// Decares all avalible routes for the page.
import { Home } from './pages/home.js' // imports the home page
import { SubmitReport } from './pages/submit-report.js'; // import the submit report

export const routes = { // varribles containing object of all routes, this is exported to the rest of the application
  '/': Home, // refernces the home page to '/'
  '/submit-report': SubmitReport, // references the submit report page to '/submit-report'
};