export interface HighlightOptions {
  /** background color of the highlighter.  A low opacity is recommended e.g. rgba(0, 0, 255, 0.2) */
  background?: string;
  /** removes/fades the highlight after some elapsed duration (in ms) */
  durationMs?: number;
  /** customize highlighter behaviors with optional CSS */
  highlighterClassName?: string;
  /** custom `querySelector` pattern for selecting elements based on the provided `elementId` */
  selector?: (elementId: string) => string;
}

/** Highlights all elements that match a provided `elementId`
 * under a `docElement` rendered by `unified-doc`
 */
export function highlight(
  /** document DOM element rendered by `unified-doc` */
  docElement: HTMLElement,
  /** target element ID of interest */
  elementId: string,
  /** options to configure `highlight` behavior */
  options?: HighlightOptions,
): () => void;
