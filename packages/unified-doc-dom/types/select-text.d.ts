export interface SelectedText {
  start: number;
  end: number;
  value: string;
}

export interface SelectTextOptions {
  callback?: (selectedText: SelectedText) => void;
}

export function selectText(
  doc: HTMLElement,
  options?: SelectTextOptions,
): () => void;
