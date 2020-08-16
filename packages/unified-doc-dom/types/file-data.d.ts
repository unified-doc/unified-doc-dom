import { FileData } from 'unified-doc-types';

export function fromFile(file: File): Promise<FileData>;

export function toFile(fileData: FileData): File;

export function saveAs(fileData): void;
