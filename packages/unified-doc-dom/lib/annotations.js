const annotationIdAttribute = 'data-annotation-id';

function noop(_annotation, _event) {}

export function registerAnnotations(docElement, annotations, callbacks = {}) {
  const elements = docElement.querySelectorAll(`[${annotationIdAttribute}]`);
  const { onClick = noop, onMouseEnter = noop, onMouseOut = noop } = callbacks;

  // initialize and track annotation callbacks by annotation id
  const annotationCallbacks = annotations.reduce((acc, annotation) => {
    acc[annotation.id] = {
      click: (event) => onClick(event, annotation),
      mouseenter: (event) => onMouseEnter(event, annotation),
      mouseout: (event) => onMouseOut(event, annotation),
    };
    return acc;
  }, {});

  function getCallbacks(element) {
    const annotationId = element.getAttribute(annotationIdAttribute);
    return annotationCallbacks[annotationId];
  }

  elements.forEach((element) => {
    const { click, mouseenter, mouseout } = getCallbacks(element);
    element.addEventListener('click', click);
    element.addEventListener('mouseenter', mouseenter);
    element.addEventListener('mouseout', mouseout);
  });

  function cleanup() {
    elements.forEach((element) => {
      const { click, mouseenter, mouseout } = getCallbacks(element);
      element.removeEventListener('click', click);
      element.removeEventListener('mouseenter', mouseenter);
      element.removeEventListener('mouseout', mouseout);
    });
  }

  return cleanup;
}
