// element js, which is a custom made function for creating html elements efficently from javascript
function Element(tag) {
  const isPropsObject = (val) =>
    Object.prototype.toString.call(val) === '[object Object]';

  let children = [];
  let propsArg = {};

  if (Array.isArray(arguments[1])) children = arguments[1];
  if (isPropsObject(arguments[1])) propsArg = arguments[1];

  if (Array.isArray(arguments[2])) children = arguments[2];
  if (isPropsObject(arguments[2])) propsArg = arguments[2];

  let {
    classList,
    style = {},
    attributes = {},
    dataset = {},
    ...props
  } = propsArg;

  const element = document.createElement(tag);

  if (classList && Array.isArray(classList)) {
    for (const className of classList) {
      element.classList.add(className);
    }
  }

  for (const [property, value] of Object.entries(style)) {
    element.style.setProperty(property, value);
  }

  for (const [attribute, value] of Object.entries(attributes)) {
    element.setAttribute(attribute, value);
  }

  for (const [key, value] of Object.entries(dataset)) {
    element.dataset[key] = value;
  }

  Object.assign(element, props);

  if (children && Array.isArray(children)) {
    element.append(...children);
  }

  return element;
}

export default Element;