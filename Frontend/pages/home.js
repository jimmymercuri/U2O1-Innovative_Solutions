
import Element from "../utilities/Element.js"; // imports element js

async function getSites(amount) { // get sites function which makes a request to the backend to get sites amount of sites wanted can be passed into the function
  const response = await fetch(`/api/sites?length=${amount}`, { // 
    method: "GET",
    credentials: "same-origin"
  });

  if (!response.ok) {
    throw new Error(`Unable to retrieve user: ${response.status}`);
  }

  const data = await response.json();

  return data.sites;
}

const sites = await getSites(5)

export const Home = Element('div', { classList: ['home'] }, [


  Element('div', {classList: ['report-content-view-container']}, [
    Element('div', {classList: ['report-content-view']}, [
      Element('h1', {textContent: 'Description'}),
      Element('p', {classList: ['extra-comments-field']})
    ]),
  ]),
  Element('div', {classList: ['sidebar']}, [
    Element('p', {textContent: 'Navigation'}),
      Element('div', {classList: ['nav-item', 'active'], onclick: () => {window.location.href = '/'}}),
      Element('div', {classList: ['nav-item'], onclick: () => {window.location.href = '/submit-report'}})
  ]),
  // Search bar
  Element('div', { classList: ['home-search'] }, [
    Element('input', {
      classList: ['home-search__input'],
      type: 'search',
      placeholder: ''
    })
  ]),

  // Page title
  Element('h1', {
    textContent: 'View Reports',
    classList: ['home-title']
  }),

  // Reports container
  Element('div', { classList: ['home-reports'] }, [
    Element('div', { classList: ['home-report', 'home-report-header'] }, [
      Element('p', { textContent: 'ID' }),
      Element('p', { textContent: 'Site' }),
      Element('p', { textContent: 'Issue' }),
      Element('p', { textContent: 'Priority' }),
      Element('p', { textContent: 'Date' })
    ]),
    ...sites.map(site => {
      return Element('div', { classList: ['home-report'], attributes: {'data-id': site.id}}, [
        Element('p', { textContent: site.id }),
        Element('p', { textContent: site.site_name }),
        Element('p', { textContent: site.site_issue }),
        Element('p', { textContent: site.site_priority }),
        Element('p', { textContent: site.date_added }),

      ]);
    })

  ])

]);