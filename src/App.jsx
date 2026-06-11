import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import MapView from './components/MapView';
import ErrorMessage from './components/ErrorMessage';
import { getRestCountriesLanguage } from './languageMap';
import './App.css';

export default function App() {
  const [books, setBooks] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [error, setError] = useState('');
  const [countryError, setCountryError] = useState('');

  const searchBooks = useCallback(async (query) => {
    setLoading(true);
    setError('');
    setSelectedBook(null);
    setCountries([]);
    setCountryError('');
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=20`
      );
      if (!res.ok) throw new Error('Erro ao buscar livros na Open Library.');
      const data = await res.json();
      setBooks(data.docs || []);
    } catch (err) {
      setError(err.message || 'Erro ao buscar livros.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectBook = useCallback(async (book) => {
    setSelectedBook(book);
    setCountries([]);
    setCountryError('');

    const languages = book.language || [];
    if (languages.length === 0) return;

    const primaryLang = languages[0];
    const langName = getRestCountriesLanguage(primaryLang);

    if (!langName) {
      setCountryError(`Idioma "${primaryLang}" nao reconhecido para busca de paises.`);
      return;
    }

    setLoadingCountries(true);
    try {
      // Busca todos os países e filtra pelo idioma exato no cliente
      // A v5 não suporta filtro exato por idioma via query param
      let allCountries = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const res = await fetch(
          `/api/countries?response_fields=names.common,codes.alpha_3,coordinates,flag.emoji,languages&limit=${limit}&offset=${offset}`,
          {
            headers: {
              'Authorization': 'Bearer rc_live_3a87ed3cbd9b41fcacc0318a08a09abb'
            }
          }
        );
        if (!res.ok) throw new Error('Erro ao buscar paises na REST Countries API.');
        const data = await res.json();
        const objects = data?.data?.objects ?? [];
        allCountries = allCountries.concat(objects);
        if (!data?.data?.meta?.more) break;
        offset += limit;
      }

      // Filtra países que têm o idioma exato
      const filtered = allCountries.filter(c =>
        Array.isArray(c.languages) &&
        c.languages.some(l =>
          l.name?.toLowerCase() === langName.toLowerCase() ||
          l.iso639_2b?.toLowerCase() === primaryLang.toLowerCase()
        )
      );

      if (filtered.length === 0) {
        setCountries([]);
        return;
      }
      console.log('todos os idiomas:', languages);
      setCountries(filtered.map(c => ({
        name: { common: c.names?.common },
        cca3: c.codes?.alpha_3,
        latlng: c.coordinates ? [c.coordinates.lat, c.coordinates.lng] : null,
        flags: { emoji: c.flag?.emoji },
      })));
    } catch (err) {
      setCountryError(err.message || 'Erro ao buscar paises.');
    } finally {
      setLoadingCountries(false);
    }
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Mapa de Livros</h1>
        <p>Pesquise um livro e visualize no mapa os paises do seu idioma</p>
      </header>
      <div className="content">
        <div className="sidebar">
          <SearchBar onSearch={searchBooks} loading={loading} />
          <ErrorMessage message={error} onDismiss={() => setError('')} />
          <BookList
            books={books}
            onSelect={selectBook}
            selectedKey={selectedBook?.key}
          />
          <BookDetail
            book={selectedBook}
            countries={countries}
            loadingCountries={loadingCountries}
            countryError={countryError}
          />
        </div>
        <div className="map-container">
          <MapView countries={countries} />
        </div>
      </div>
    </div>
  );
}