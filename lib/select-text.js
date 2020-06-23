import rangy from 'rangy';

export default function selectText(doc, options = {}) {
  const { callback = () => {} } = options;

  function handleSelectText() {
    const selection = rangy.getSelection();
    const bookmark = selection.getBookmark(doc);
    const { start, end } = bookmark.rangeBookmarks[0];
    if (Number.isInteger(start) && Number.isInteger(end) && end > start) {
      const value = doc.textContent.slice(start, end);
      callback({ start, end, value });
    }
    selection.removeAllRanges();
  }

  function cleanup() {
    doc.removeEventListener('mouseup', handleSelectText);
  }

  doc.addEventListener('mouseup', handleSelectText);

  return cleanup;
}
