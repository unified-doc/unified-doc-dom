import { Mark } from 'unified-doc-types';

type MarkCallback = (event: MouseEvent, mark: Mark) => void;

interface MarkCallbacks {
  onClick?: MarkCallback;
  onMouseEnter?: MarkCallback;
  onMouseOut?: MarkCallback;
}

/** Registers all `mark` elements with provided callbacks
 * under a `docElement` rendered by `unified-doc`
 */
export function registerMarks(
  /** document DOM element rendered by `unified-doc` */
  docElement: HTMLElement,
  /** array of `marks` data used by `unified-doc` **/
  marks: Mark[],
  /** callbacks to apply to marked elements */
  callbacks: MarkCallbacks,
);
