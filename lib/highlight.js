import ResizeObserver from 'resize-observer-polyfill';

function createHighlighter({
  durationMs,
  highlighterClassName,
  highlighterId,
  style,
}) {
  const {
    animationTimingFunction = 'ease-out',
    background = 'rgba(11, 95, 255, 0.2)',
  } = style;

  const highlighter = document.createElement('div');
  highlighter.setAttribute('id', highlighterId);
  highlighter.className = highlighterClassName;
  highlighter.style.animationDuration = `${durationMs}ms`;
  highlighter.style.animationTimingFunction = animationTimingFunction;
  highlighter.style.background = background;
  highlighter.style.left = '0';
  highlighter.style.position = 'absolute';
  highlighter.style.right = '0';
  highlighter.style.top = '0';

  return highlighter;
}

function removeHighlighter(highlighterId) {
  const highlighter = document.getElementById(highlighterId);
  if (highlighter) {
    highlighter.remove();
  }
}

function resizeHighlighter(highlighter, { height, left, width }) {
  highlighter.style.height = `${height}px`;
  highlighter.style.left = `${left}px`;
  highlighter.style.width = `${width}px`;
}

/**
 * When the document.location.hash value changes, highlight the DOM element
 * that matches the corresponding ID.
 */
export default function highlight(doc, elementId, options = {}) {
  const {
    callback = () => {},
    durationMs = 3000,
    highlighterClassName = 'unified-doc-highlighter',
    highlighterId = 'unified-doc-highlighter',
    style = {},
  } = options;

  // remove highlighter if it exists
  removeHighlighter(highlighterId);

  let highlighter;
  let resizeObserver;
  const element = document.getElementById(elementId);

  function cleanup() {
    if (highlighter) {
      highlighter.remove();
    }
    if (resizeObserver) {
      resizeObserver.unobserve(doc);
    }
  }

  // highlight element if it exists
  if (element) {
    const sourceElementPosition = element.style.position;

    highlighter = createHighlighter({
      highlighterId,
      highlighterClassName,
      durationMs,
      style,
    });

    // resize highlighter when doc dimensions change
    resizeObserver = new ResizeObserver(() => {
      const docBox = doc.getBoundingClientRect();
      const elementBox = element.getBoundingClientRect();
      const resizeOptions = {
        height: element.offsetHeight,
        width: docBox.width,
        left: docBox.x - elementBox.x,
      };
      resizeHighlighter(highlighter, resizeOptions);
    });
    resizeObserver.observe(doc);

    // attach highlighter
    element.style.position = 'relative';
    element.append(highlighter);

    // cleanup after durationMs has elapsed
    setTimeout(() => {
      element.style.position = sourceElementPosition;
      cleanup();
    }, durationMs);

    callback(element);
  }

  return cleanup;
}
