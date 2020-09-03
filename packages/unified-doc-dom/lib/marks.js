import { DATA_MARK_ID_ATTRIBUTE } from './enums';

function noop(_mark, _event) {}

export function registerMarks(docElement, marks, callbacks = {}) {
  const elements = docElement.querySelectorAll(`[${DATA_MARK_ID_ATTRIBUTE}]`);
  const { onClick = noop, onMouseEnter = noop, onMouseOut = noop } = callbacks;

  // initialize and track mark callbacks by mark id
  const markCallbacks = marks.reduce((acc, mark) => {
    acc[mark.id] = {
      click: (event) => onClick(event, mark),
      mouseenter: (event) => onMouseEnter(event, mark),
      mouseout: (event) => onMouseOut(event, mark),
    };
    return acc;
  }, {});

  function getCallbacks(element) {
    const markId = element.getAttribute(DATA_MARK_ID_ATTRIBUTE);
    return markCallbacks[markId];
  }

  elements.forEach((element) => {
    const { click, mouseenter, mouseout } = getCallbacks(element) || {};
    if (click) {
      element.addEventListener('click', click);
    }
    if (mouseenter) {
      element.addEventListener('mouseenter', mouseenter);
    }
    if (mouseout) {
      element.addEventListener('mouseout', mouseout);
    }
  });

  function cleanup() {
    elements.forEach((element) => {
      const { click, mouseenter, mouseout } = getCallbacks(element) || {};
      if (click) {
        element.removeEventListener('click', click);
      }
      if (mouseenter) {
        element.removeEventListener('mouseenter', mouseenter);
      }
      if (mouseout) {
        element.removeEventListener('mouseout', mouseout);
      }
    });
  }

  return cleanup;
}
