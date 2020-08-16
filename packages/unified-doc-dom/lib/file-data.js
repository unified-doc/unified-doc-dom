import fileSaver from 'file-saver';

export async function fromFile(file) {
  const content = await file.text();
  const { name, type } = file;

  let extension = '';
  const parts = name.split('.');
  if (parts.length > 1) {
    extension = parts.pop();
  }
  const stem = parts.join('.');

  return {
    content,
    extension,
    name,
    stem,
    type,
  };
}

export function toFile(fileData) {
  const { content, name, type } = fileData;
  return new File([content], name, { type });
}

export function saveAs(fileData) {
  const file = toFile(fileData);
  fileSaver.saveAs(file);
}
