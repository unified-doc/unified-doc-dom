import ResizeObserver from 'resize-observer-polyfill';

const defaultOptions = {
  background: 'rgba(11, 95, 255, 0.2)',
  durationMs: 6000,
  highlighterClassName: 'unified-doc-highlighter',
  selector: (elementId) => `[data-annotation-id='${elementId}']`,
};

class Highlighter {
  constructor(target, options) {
    const { background, durationMs, highlighterClassName } = options;

    // cleanup any old instances
    const oldHighlighter = document.querySelector(`.${highlighterClassName}`);
    if (oldHighlighter) {
      oldHighlighter.remove();
    }

    // create highlighter
    this.highlighter = document.createElement('div');
    this.highlighter.className = highlighterClassName;
    this.highlighter.style.background = background;
    this.highlighter.style.left = '0';
    this.highlighter.style.position = 'fixed';
    this.highlighter.style.right = '0';
    this.highlighter.style.top = '0';
    this.highlighter.style.animationDuration = `${durationMs}ms`;

    if (target) {
      target.append(this.highlighter);
    }
  }

  destroy() {
    this.highlighter.remove();
  }

  update({ height, left, top, width }) {
    this.highlighter.style.height = `${height}px`;
    this.highlighter.style.left = `${left}px`;
    this.highlighter.style.top = `${top}px`;
    this.highlighter.style.width = `${width}px`;
  }
}

function getBoundary(context, first, next) {
  const contextRect = context.getBoundingClientRect();
  const firstRect = first.getBoundingClientRect();
  const nextRect = next.getBoundingClientRect();
  return {
    height: nextRect.bottom - firstRect.top,
    left: contextRect.left,
    top: firstRect.top,
    width: contextRect.width,
  };
}

export default function highlight(docElement, elementId, options) {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  const { durationMs, selector } = mergedOptions;

  const elements = document.querySelectorAll(selector(elementId));
  const first = elements[0];
  const last = elements[elements.length - 1];

  // create highlighter and update on resize/scroll
  const highlighter = new Highlighter(first, mergedOptions);
  const resizeObserver = new ResizeObserver(() => update());
  resizeObserver.observe(docElement);
  window.addEventListener('scroll', update);

  // cleanup based on animation duration timeout, and return cleanup function
  const timeout = setTimeout(() => cleanup(), durationMs);

  function update() {
    if (first && last) {
      highlighter.update(getBoundary(docElement, first, last));
    }
  }

  function cleanup() {
    clearTimeout(timeout);
    highlighter.destroy();
    resizeObserver.unobserve(docElement);
    window.removeEventListener('scroll', update);
  }

  return cleanup;
}
