import { createContext, useContext, useState } from 'react'

const SearchContext = createContext(null)

const DEFAULT_SEARCH = {
  from: '',
  to: '',
  date: '',
}

export function SearchProvider({ children }) {
  const [search, setSearch] = useState(DEFAULT_SEARCH)

  function updateSearch(fields) {
    setSearch(prev => ({ ...prev, ...fields }))
  }

  function resetSearch() {
    setSearch(DEFAULT_SEARCH)
  }

  return (
    <SearchContext.Provider value={{ search, updateSearch, resetSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within a SearchProvider')
  return ctx
}
