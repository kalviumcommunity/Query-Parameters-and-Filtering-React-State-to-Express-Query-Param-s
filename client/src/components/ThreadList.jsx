
import { useState, useEffect } from "react";
import {
  useQuery,
  keepPreviousData
} from "@tanstack/react-query";

import { getThreads } from "../services/threads.service";
import SearchBar from "./SearchBar.jsx";
import SortDropdown from "./SortDropdown.jsx";

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ThreadList() {
  // Step 1: Search and sort states
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // Step 2: Debounce search (300ms)
  const debouncedSearch = useDebounce(search, 300);

  // Step 3: Fetch threads using dynamic query
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["threads", { search: debouncedSearch, sort }],

    queryFn: ({ queryKey }) => getThreads(queryKey[1]),

    placeholderData: keepPreviousData
  });

  return (
    <div>
      <div className="filters">
        {/* Search input */}
        <SearchBar
          value={search}
          onChange={setSearch}
        />

        {/* Sort dropdown */}
        <SortDropdown
          value={sort}
          onChange={setSort}
        />
      </div>

      {/* Error handling */}
      {isError && (
        <p className="err">
          Error: {error.message}
        </p>
      )}

      {/* Loading state */}
      {isPending ? (
        <p>Loading threads…</p>
      ) : (
        <ul className="threads">
          {(data ?? []).map((t) => (
            <li className="card" key={t.id}>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
