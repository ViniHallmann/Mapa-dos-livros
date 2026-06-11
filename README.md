# Mapa de Livros

Aplicação web em **React + Vite** que permite pesquisar livros e visualizar, em um mapa interativo, os países relacionados ao idioma principal da obra selecionada.

A busca de livros usa a **Open Library API** e a consulta de países por idioma usa a **REST Countries API**. A visualização geográfica é feita com **React Leaflet**.

## Funcionalidades

- Pesquisa de livros por título (Open Library).
- Lista de resultados com capa, autor, ano de publicação e idioma(s).
- Detalhe da obra selecionada (título, autor, ano, idioma e capa quando disponível).
- A partir do idioma principal do livro, consulta os países associados (REST Countries) e os destaca no mapa com marcadores e popups.
- Tratamento de erros e estados de borda:
  - Busca sem resultados.
  - Obra sem idioma informado.
  - Idioma sem países associados / idioma não reconhecido.
  - Falha de rede ou erro nas APIs.

## Como executar

Pré-requisitos: **Node.js 18+** instalado.

```bash
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

Para gerar o build de produção:

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```
src/
├── App.jsx                  # Componente raiz: estado e orquestração das chamadas às APIs
├── languageMap.js           # Mapeamento de códigos de idioma (Open Library -> nome / REST Countries)
├── components/
│   ├── SearchBar.jsx        # Campo de busca
│   ├── BookList.jsx         # Lista de resultados
│   ├── BookDetail.jsx       # Detalhe da obra + países do idioma
│   ├── MapView.jsx          # Mapa Leaflet com marcadores dos países
│   └── ErrorMessage.jsx     # Faixa de erro reutilizável
```

## Decisões tomadas

- **React + Vite**: scaffolding rápido e HMR; estrutura simples sem necessidade de framework adicional.
- **Estado local com hooks (`useState` / `useCallback`)**: o app tem um fluxo único (buscar → selecionar → mapear), então não há necessidade de Redux/Context.
- **`fetch` nativo**: conforme a especificação, sem bibliotecas HTTP extras.
- **Mapeamento de idiomas (`languageMap.js`)**: a Open Library retorna códigos MARC de 3 letras (`eng`, `por`, `spa`...), enquanto a REST Countries espera o nome do idioma em inglês (`english`, `portuguese`...). Criamos uma tabela de conversão e tratamos códigos não reconhecidos como caso de borda.
- **Idioma principal**: quando uma obra lista vários idiomas, usamos o **primeiro** como idioma principal para a consulta de países (regra simples e previsível).
- **React Leaflet com `circleMarker`**: usamos as coordenadas `latlng` que a própria REST Countries fornece, evitando carregar um GeoJSON pesado de polígonos de países. Os marcadores são destacados e o mapa faz `fitBounds` automático para enquadrar os países encontrados.
- **Tratamento de erros explícito**: erros de busca e erros de países são separados em estados distintos, com mensagens claras para o usuário; um `404` da REST Countries é tratado como "nenhum país encontrado" em vez de erro.

## APIs utilizadas

- Open Library Search: `https://openlibrary.org/search.json?title=...`
- Capas: `https://covers.openlibrary.org/b/id/{cover_i}-{S|M}.jpg`
- REST Countries: `https://restcountries.com/v3.1/lang/{idioma}?fields=name,cca3,latlng,flag`
- Tiles do mapa: OpenStreetMap

## Documentação do processo com IA

O processo de desenvolvimento assistido por IA está documentado em [DESENVOLVIMENTO-IA.md](DESENVOLVIMENTO-IA.md).
