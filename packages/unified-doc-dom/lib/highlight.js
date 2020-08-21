import ResizeObserver from 'resize-observer-polyfill';

import { DATA_MARK_ID_ATTRIBUTE } from './enums';

const defaultOptions = {
  background: 'rgba(11, 95, 255, 0.2)',
  durationMs: 5000,
  highlighterClassName: 'unified-doc-highlighter',
  selector: (elementId) => `[${DATA_MARK_ID_ATTRIBUTE}='${elementId}']`,
};

class Highlighter {
  constructor(targetElement, options) {
    const { background, durationMs, highlighterClassName } = options;

    // cleanup any old instances
    const oldHighlighter = document.querySelector(`.${highlighterClassName}`);
    if (oldHighlighter) {
      oldHighlighter.remove();
    }

    // create highlighter
    this.highlighterElement = document.createElement('div');
    this.highlighterElement.className = highlighterClassName;
    this.highlighterElement.style.background = background;
    this.highlighterElement.style.left = '0';
    this.highlighterElement.style.position = 'fixed';
    this.highlighterElement.style.right = '0';
    this.highlighterElement.style.top = '0';
    this.highlighterElement.style.animationDuration = `${durationMs}ms`;

    if (targetElement) {
      targetElement.append(this.highlighterElement);
    }
  }

  destroy() {
    this.highlighterElement.remove();
  }

  update({ height, left, top, width }) {
    this.highlighterElement.style.height = `${height}px`;
    this.highlighterElement.style.left = `${left}px`;
    this.highlighterElement.style.top = `${top}px`;
    this.highlighterElement.style.width = `${width}px`;
  }
}

function getBoundary(contextElement, firstElement, nextElement) {
  const contextRect = contextElement.getBoundingClientRect();
  const firstElementRect = firstElement.getBoundingClientRect();
  const nextElementRect = nextElement.getBoundingClientRect();
  return {
    height: nextElementRect.bottom - firstElementRect.top,
    left: contextRect.left,
    top: firstElementRect.top,
    width: contextRect.width,
  };
}

export function highlight(docElement, elementId, options) {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };
  const { durationMs, selector } = mergedOptions;

  const elements = docElement.querySelectorAll(selector(elementId));
  const firstElement = elements[0];
  const lastElement = elements[elements.length - 1];

  // create highlighter and update on resize/scroll
  const highlighter = new Highlighter(firstElement, mergedOptions);
  const resizeObserver = new ResizeObserver(() => update());
  resizeObserver.observe(docElement);
  window.addEventListener('scroll', update);

  // cleanup based on animation duration timeout, and return cleanup function
  const timeout = setTimeout(() => cleanup(), durationMs);

  function update() {
    if (firstElement && lastElement) {
      highlighter.update(getBoundary(docElement, firstElement, lastElement));
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
