export interface SelectedText {
  /** start offset of selected text relative to `textContent` of the `docElement` */
  start: number;
  /** end offset of selected text relative to `textContent` of the `docElement` */
  end: number;
  /** selected text value */
  value: string;
}

export interface SelectTextOptions {
  /** captures the `SelectedText` object in a callback */
  callback?: (selectedText: SelectedText) => void;
}

/** Capture text selection values (`mark`-compatible) under the
 * `docElement` rendered by `unified-doc`.
 */
export function selectText(
  /** document DOM element rendered by `unified-doc` */
  docElement: HTMLElement,
  /** options to configure `selectText` behavior */
  options?: SelectTextOptions,
): () => void;
