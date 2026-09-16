// Hi Zack

import Element from "../utilities/Element.js";

export const issues = [
  { id: 1, name: "Active bushfire", value: 10 },
  { id: 2, name: "Flood", value: 9 },
  { id: 3, name: "Grass fire", value: 8 },
  { id: 4, name: "Severe storm damage", value: 8 },
  { id: 5, name: "Fallen tree", value: 7 },
  { id: 6, name: "Dangerous wildlife", value: 7 },
  { id: 7, name: "Major track damage", value: 6 },
  { id: 8, name: "Water contamination", value: 6 },
  { id: 9, name: "Invasive species", value: 5 },
  { id: 10, name: "Pest outbreak", value: 5 },
  { id: 11, name: "Erosion", value: 4 },
  { id: 12, name: "Illegal dumping", value: 4 },
  { id: 13, name: "Minor track damage", value: 3 },
  { id: 14, name: "Minor vegetation damage", value: 3 },
  { id: 15, name: "Litter", value: 2 },
  { id: 16, name: "Minor maintenance issue", value: 1 }
];




async function getSites(amount) {
  const response = await fetch(`/api/sites?length=${amount}`, {
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
      Element('h1', {textContent: 'Extra Comments:'}),
      Element('p', {classList: ['extra-comments-field']})
    ]),
  ]),
  Element('div', {classList: ['sidebar']}, [
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