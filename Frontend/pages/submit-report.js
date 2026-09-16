import Element from "../utilities/Element.js";

const issueScores = {
  1: 10, // Active bushfire
  2: 9,  // Flood
  3: 8,  // Grass fire
  4: 8,  // Severe storm damage
  5: 7,  // Fallen tree
  6: 7,  // Dangerous wildlife
  7: 6,  // Major track damage
  8: 6,  // Water contamination
  9: 5,  // Invasive species
  10: 5, // Pest outbreak
  11: 4, // Erosion
  12: 4, // Illegal dumping
  13: 3, // Minor track damage
  14: 3, // Minor vegetation damage
  15: 2, // Litter
  16: 1  // Minor maintenance issue
};

const issueInput = Element('input', {
  type: 'hidden',
  name: 'issue',
  value: ''
});

const issueSelect = Element('select', {
  classList: ['report-issue'],
  name: 'issue_id',
  required: true
}, [

  Element('option', {
    textContent: 'Select Issue',
    value: ''
  }),

  Element('option', {
    textContent: 'Active bushfire',
    value: 1
  }),

  Element('option', {
    textContent: 'Flood',
    value: 2
  }),

  Element('option', {
    textContent: 'Grass fire',
    value: 3
  }),

  Element('option', {
    textContent: 'Severe storm damage',
    value: 4
  }),

  Element('option', {
    textContent: 'Fallen tree',
    value: 5
  }),

  Element('option', {
    textContent: 'Dangerous wildlife',
    value: 6
  }),

  Element('option', {
    textContent: 'Major track damage',
    value: 7
  }),

  Element('option', {
    textContent: 'Water contamination',
    value: 8
  }),

  Element('option', {
    textContent: 'Invasive species',
    value: 9
  }),

  Element('option', {
    textContent: 'Pest outbreak',
    value: 10
  }),

  Element('option', {
    textContent: 'Erosion',
    value: 11
  }),

  Element('option', {
    textContent: 'Illegal dumping',
    value: 12
  }),

  Element('option', {
    textContent: 'Minor track damage',
    value: 13
  }),

  Element('option', {
    textContent: 'Minor vegetation damage',
    value: 14
  }),

  Element('option', {
    textContent: 'Litter',
    value: 15
  }),

  Element('option', {
    textContent: 'Minor maintenance issue',
    value: 16
  })

]);

issueSelect.addEventListener('change', () => {
  issueInput.value = issueScores[issueSelect.value] ?? '';
});


export const SubmitReport = Element('div', {
  classList: ['submit-report']
}, [

  Element('div', {classList: ['sidebar']}, [
    Element('div', {classList: ['nav-item'], onclick: () => {window.location.href ='/'}}),
    Element('div', {classList: ['nav-item', 'active'], onclick: () => {window.location.href = '/submit-report'}})
  ]),

  Element('h1', {
    textContent: 'Submit Report',
    classList: ['submit-report-title']
  }),

  Element('form', {
    classList: ['submit-report-form'],
    method: 'post',
    action: '/submit-report'
  }, [

    // LEFT SIDE
    Element('div', {
      classList: ['report-left']
    }, [

      Element('input', {
        classList: ['report-name'],
        type: 'text',
        name: 'name',
        placeholder: 'Site Name',
        required: true
      }),

      Element('textarea', {
        classList: ['report-description'],
        name: 'description',
        placeholder: 'Extra Comments'
      })

    ]),

    // RIGHT SIDE
    Element('div', {
      classList: ['report-right']
    }, [

      // ISSUE
      issueSelect,

      // Hidden issue score used for calculations
      issueInput,

      // HAZARD
      Element('input', {
        classList: ['report-hazard'],
        type: 'number',
        name: 'hazard',
        placeholder: 'Hazard (1 - 10)',
        min: 1,
        max: 10,
        required: true
      }),

      // EXTENT
      Element('input', {
        classList: ['report-extent'],
        type: 'number',
        name: 'extent',
        placeholder: 'Extent (1 - 10)',
        min: 1,
        max: 10,
        required: true
      }),

      // ESCALATION
      Element('input', {
        classList: ['report-escalation'],
        type: 'number',
        name: 'escalation',
        placeholder: 'Escalation (1 - 10)',
        min: 1,
        max: 10,
        required: true
      }),

      // EXPOSURE
      Element('input', {
        classList: ['report-exposure'],
        type: 'number',
        name: 'exposure',
        placeholder: 'Exposure (1 - 10)',
        min: 1,
        max: 10,
        required: true
      }),

      // SUBMIT
      Element('button', {
        classList: ['report-submit'],
        type: 'submit',
        textContent: 'Submit Report'
      })

    ])

  ])

]);