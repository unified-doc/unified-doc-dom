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

export interface SelectedText {
  start: number;
  end: number;
  value: string;
}

export interface SelectTextOptions {
  callback?: (selectedText: SelectedText) => void;
}

export function highlight(
  doc: HTMLElement,
  elementId: string,
  options: HighlightOptions,
): () => void;

export function selectText(
  doc: HTMLElement,
  options: SelectTextOptions,
): () => void;
