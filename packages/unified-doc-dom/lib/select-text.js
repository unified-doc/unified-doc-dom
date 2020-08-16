import rangy from 'rangy';

const defaultOptions = {
  callback: (_selectedText) => {},
};

export default function selectText(docElement, options = defaultOptions) {
  function select() {
    const selection = rangy.getSelection();
    const bookmark = selection.getBookmark(docElement);
    const { start, end } = bookmark.rangeBookmarks[0];
    if (end > start) {
      const value = docElement.textContent.slice(start, end);
      options.callback({ start, end, value });
    }
    selection.removeAllRanges();
  }

  function cleanup() {
    docElement.removeEventListener('mouseup', select);
  }

  docElement.addEventListener('mouseup', select);

  return cleanup;
}
