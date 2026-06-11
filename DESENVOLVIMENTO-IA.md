# Processo de Desenvolvimento com IA — Mapa de Livros

Este documento descreve todo o processo de obtenção do projeto, destacando a interação
com a IA (Claude) a partir do momento em que iniciou o tratamento da especificação
apresentada na Atividade 10.

## 1. Tratamento da especificação

O ponto de partida foi a especificação da atividade: desenvolver uma aplicação web em
React + Vite que pesquise livros (Open Library API) e mostre, em um mapa (Leaflet /
React Leaflet), os países relacionados ao idioma da obra selecionada (REST Countries API).

A partir do enunciado, a IA decompôs o problema nos seguintes requisitos concretos:

1. Buscar livros por título.
2. Listar resultados e permitir selecionar uma obra.
3. Exibir informações básicas (título, autor, ano, idioma, capa).
4. A partir do idioma, consultar países e destacá-los no mapa.
5. Tratar os casos de borda exigidos: sem resultados, sem idioma, sem países, erro de API.
6. Organizar o código em componentes React e usar `fetch`.

## 2. Decisões técnicas discutidas com a IA

- **Scaffolding**: usar `npm create vite@latest -- --template react`, seguido de
  `npm install react-leaflet leaflet`.
- **Arquitetura de componentes**: separar responsabilidades em `SearchBar`, `BookList`,
  `BookDetail`, `MapView` e `ErrorMessage`, com `App.jsx` concentrando o estado e as
  chamadas às APIs.
- **Mapeamento de idiomas**: ponto crítico identificado pela IA — a Open Library devolve
  códigos MARC de 3 letras (`eng`, `por`, ...) enquanto a REST Countries espera o nome do
  idioma em inglês (`english`, `portuguese`, ...). A solução foi criar `languageMap.js`
  com uma tabela de conversão e tratar códigos desconhecidos como caso de borda.
- **Mapa**: em vez de carregar polígonos GeoJSON de países (pesado), usar as coordenadas
  `latlng` já fornecidas pela REST Countries e renderizar `circleMarker` com popup, além
  de `fitBounds` automático para enquadrar os países encontrados.

## 3. Implementação

A IA gerou, em sequência:

1. Os arquivos de estilo base (`index.css`, `App.css`) com layout de duas colunas
   (sidebar + mapa) e responsividade.
2. O utilitário `languageMap.js`.
3. Os componentes em `src/components/` com seus respectivos CSS.
4. O `App.jsx` com a lógica de busca (`searchBooks`) e seleção (`selectBook`),
   incluindo todos os estados (`loading`, `error`, `countries`, `countryError`).
5. Ajuste no `MapView.jsx` para importar `L` diretamente de `leaflet` (em vez de
   `window.L`/`require`, que não funcionam em ambiente Vite/ESM).

## 4. Verificação

A aplicação foi executada com `npm run dev` e testada no navegador:

- Busca por "harry potter" retornou a lista de resultados com capas e idiomas.
- Selecionando "Harry Potter and the Chamber of Secrets" (idioma principal: turco),
  a aplicação consultou a REST Countries e exibiu **Cyprus** e **Turkey**, com os
  respectivos marcadores destacados no mapa.
- Não houve erros no console.

## 5. Casos de borda tratados

| Situação                                   | Comportamento                                              |
|--------------------------------------------|------------------------------------------------------------|
| Busca sem resultados                       | Mensagem "Nenhum livro encontrado".                        |
| Obra sem idioma informado                  | "Sem idioma informado para buscar países".                 |
| Idioma não mapeado                         | Mensagem indicando idioma não reconhecido.                 |
| Idioma sem países (404 REST Countries)     | "Nenhum país encontrado para este idioma".                 |
| Erro de rede / falha da API                | Faixa de erro vermelha dispensável pelo usuário.           |

## 6. Papel da IA no processo

A IA atuou como par de programação: interpretou a especificação, propôs a arquitetura,
identificou o problema de incompatibilidade entre os códigos de idioma das duas APIs
(principal armadilha do projeto), gerou o código dos componentes, executou a aplicação,
verificou o funcionamento no navegador e documentou as decisões. As escolhas finais de
design e simplificação (idioma principal único, marcadores em vez de polígonos) foram
validadas durante essa interação.
