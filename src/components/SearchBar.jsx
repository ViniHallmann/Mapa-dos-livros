import { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Pesquisar livro pelo titulo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !query.trim()}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
}
