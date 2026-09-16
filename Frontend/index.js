import Element from './utilities/Element.js';
import { routes } from './routes.js'; // get all the routes that the app supports and its corrisponding page
const app = document.getElementById('app');

if (!app) {
  throw new Error(
    'Unable to find element with ID "app"'
  );
}

const pathname = window.location.pathname; 


if(routes[pathname]){
  app.append(routes[pathname])
} else {
  app.append(Element('h1', {textContent: 'Unable to find page'}))
}


