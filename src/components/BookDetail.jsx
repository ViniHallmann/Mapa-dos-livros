import { getLanguageName } from '../languageMap';
import './BookDetail.css';

export default function BookDetail({ book, countries, loadingCountries, countryError }) {
  if (!book) {
    return (
      <div className="book-detail-empty">
        Selecione um livro para ver detalhes e visualizar os paises no mapa.
      </div>
    );
  }

  const coverId = book.cover_i;
  const languages = book.language || [];

  return (
    <div className="book-detail">
      <div className="book-detail-header">
        {coverId ? (
          <img
            className="book-detail-cover"
            src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
            alt={book.title}
          />
        ) : (
          <div className="book-detail-cover-placeholder">Sem capa</div>
        )}
        <div className="book-detail-info">
          <h3>{book.title}</h3>
          {book.author_name && (
            <p className="detail-author">{book.author_name.join(', ')}</p>
          )}
          {book.first_publish_year && (
            <p className="detail-year">Publicado em: {book.first_publish_year}</p>
          )}
          {languages.length > 0 ? (
            <p className="detail-lang">
              Idioma(s): {languages.map(getLanguageName).join(', ')}
            </p>
          ) : (
            <p className="detail-lang detail-no-lang">Idioma nao informado</p>
          )}
        </div>
      </div>

      <div className="book-detail-countries">
        <h4>Paises relacionados ao idioma</h4>
        {loadingCountries && <p className="countries-loading">Carregando paises...</p>}
        {countryError && <p className="countries-error">{countryError}</p>}
        {!loadingCountries && !countryError && countries.length === 0 && languages.length > 0 && (
          <p className="countries-empty">Nenhum pais encontrado para este idioma.</p>
        )}
        {!loadingCountries && languages.length === 0 && (
          <p className="countries-empty">Sem idioma informado para buscar paises.</p>
        )}
        {countries.length > 0 && (
          <div className="countries-list">
            {countries.map((c) => (
              <span key={c.cca3} className="country-tag">
                {c.flag} {c.name.common}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
