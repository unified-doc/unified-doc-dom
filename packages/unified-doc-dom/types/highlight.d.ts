export interface HighlightOptions {
  callback?: (element: HTMLElement) => void;
  durationMs?: number;
  highlighterClassName?: string;
  highlighterId?: string;
  style?: {
    animationTimingFunction?: string;
    background?: string;
  };
}

export function highlight(
  doc: HTMLElement,
  elementId: string,
  options?: HighlightOptions,
): () => void;
