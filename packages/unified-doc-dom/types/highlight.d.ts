export interface HighlightOptions {
  background?: string;
  durationMs?: number;
  highlighterClassName?: string;
  selector?: (elementId: string) => string;
}

export function highlight(
  docElement: HTMLElement,
  elementId: string,
  options?: HighlightOptions,
): () => void;
