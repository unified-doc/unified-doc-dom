import { FileData } from 'unified-doc-types';

/** returns `FileData` from a JS `File` */
export function fromFile(file: File): Promise<FileData>;

/** returns a JS `File` from `FileData` */
export function toFile(fileData: FileData): File;

/** saves a JS `File` from `FileData` */
export function saveFile(fileData: FileData): void;
