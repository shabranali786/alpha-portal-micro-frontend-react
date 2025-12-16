import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import apiAxios from "../api/ApiAxios";

const cache = new Map();

const getCacheKey = (endpoint, page, limit, search, query, deps) => {
  const queryStr = query ? JSON.stringify(query) : "";
  const depsStr = JSON.stringify(deps);
  return `${endpoint}|${page}|${limit}|${search}|${queryStr}|${depsStr}`;
};

export const usePaginatedData = (apiEndpoint, dependencies = []) => {
  const [data, setData] = useState([]);
  const [rootData, setRootData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [queryParams, setQueryParams] = useState({});

  const fetchData = useCallback(
    async (...callArgs) => {
      if (!apiEndpoint) {
        setData([]);
        setTotalRows(0);
        setRootData(null);
        setLoading(false);
        return { items: [], totalRows: 0, rootData: null };
      }
      let config;

      if (
        callArgs.length === 0 ||
        (callArgs.length === 1 &&
          typeof callArgs[0] === "object" &&
          !Array.isArray(callArgs[0]))
      ) {
        config = callArgs[0] || {};
      } else {
        const [pageArg, limitArg, searchArg, forceArg] = callArgs;
        config = {
          page: pageArg,
          limit: limitArg,
          search: searchArg,
          force: forceArg,
        };
      }

      const {
        page = currentPage,
        limit = perPage,
        search = searchTerm,
        force = false,
        silent = false,
        query = queryParams,
      } = config;

      // Generate cache key
      const cacheKey = getCacheKey(
        apiEndpoint,
        page,
        limit,
        search,
        query,
        dependencies
      );

      // Check cache (if not forced refresh)
      if (!force && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        setData(cached.items);
        setTotalRows(cached.totalRows);
        setRootData(cached.rootData);
        setLoading(false);
        return cached;
      }

      // Fetch silent
      if (!silent) {
        setLoading(true);
      }
      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: limit.toString(),
        });

        if (search?.toString().trim()) {
          params.append("search", search.toString().trim());
          params.append("name", search.toString().trim());
        }

        // Add custom query params
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, value);
          }
        });

        // API call
        const { data } = await apiAxios.get(
          `${apiEndpoint}?${params.toString()}`
        );

        // Handle response
        let items = [];
        let total = 0;

        if (Array.isArray(data.data)) {
          items = data.data;
          total = data?.meta?.total ?? data?.total ?? 0;
        }

        // Update state
        setData(items);
        setTotalRows(total);
        setRootData(data);

        // Save to cache
        cache.set(cacheKey, {
          items,
          totalRows: total,
          rootData: data,
        });

        return { items, totalRows: total, rootData: data };
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch data");
        setData([]);
        setTotalRows(0);
        setRootData(null);
        return null;
      } finally {
        setLoading(false);
      }
    },

    [
      apiEndpoint,
      currentPage,
      perPage,
      searchTerm,
      queryParams,
      ...dependencies,
    ]
  );

  const handleSearch = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  }, []);

  const refresh = useCallback(() => {
    if (!apiEndpoint) {
      return Promise.resolve({ items: [], totalRows: 0, rootData: null });
    }
    return fetchData({
      page: currentPage,
      limit: perPage,
      search: searchTerm,
      query: queryParams,
      force: true,
    });
  }, [currentPage, perPage, searchTerm, queryParams, fetchData]);

  useEffect(() => {
    if (apiEndpoint) {
      fetchData({
        page: currentPage,
        limit: perPage,
        search: searchTerm,
        query: queryParams,
      });
    }
  }, [currentPage, perPage, searchTerm, queryParams, fetchData]);

  return {
    // Data
    data,
    loading,
    totalRows,
    rootData,

    // Pagination
    currentPage,
    perPage,
    setCurrentPage,
    setPerPage,

    // Search
    searchTerm,
    handleSearch,

    // Actions
    refresh,
    fetchData,
    queryParams,
    setQueryParams,
  };
};
