import { Annotation } from 'unified-doc-types';

type AnnotationCallback = (annotation: Annotation, event?: MouseEvent) => void;

interface AnnotationCallbacks {
  onClick?: AnnotationCallback;
  onMouseEnter?: AnnotationCallback;
  onMouseOut?: AnnotationCallback;
}

export function registerAnnotations(
  docElement: HTMLElement,
  annotations: Annotation[],
  callbacks: AnnotationCallbacks,
);
