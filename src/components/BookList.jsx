import { getLanguageName } from '../languageMap';
import './BookList.css';

export default function BookList({ books, onSelect, selectedKey }) {
  if (!books) return null;

  if (books.length === 0) {
    return (
      <div className="book-list-empty">
        Nenhum livro encontrado. Tente outro termo de busca.
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => {
        const key = book.key;
        const coverId = book.cover_i;
        const languages = book.language || [];
        const isSelected = selectedKey === key;

        return (
          <div
            key={key}
            className={`book-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(book)}
          >
            {coverId ? (
              <img
                className="book-cover-thumb"
                src={`https://covers.openlibrary.org/b/id/${coverId}-S.jpg`}
                alt={book.title}
              />
            ) : (
              <div className="book-cover-placeholder">Sem capa</div>
            )}
            <div className="book-item-info">
              <span className="book-item-title">{book.title}</span>
              {book.author_name && (
                <span className="book-item-author">
                  {book.author_name.slice(0, 2).join(', ')}
                </span>
              )}
              {book.first_publish_year && (
                <span className="book-item-year">{book.first_publish_year}</span>
              )}
              {languages.length > 0 && (
                <span className="book-item-lang">
                  {languages.slice(0, 3).map(getLanguageName).join(', ')}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
