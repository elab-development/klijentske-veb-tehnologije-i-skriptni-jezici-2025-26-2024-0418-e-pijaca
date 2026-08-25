import { useState, useEffect } from 'react';

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string | null, options?: RequestInit): State<T> & { refetch: () => void } {
  const [state, setState] = useState<State<T>>({ data: null, loading: !!url, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(url, options)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((e) => active && setState({ data: null, loading: false, error: String(e.message ?? e) }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, tick]);

  return { ...state, refetch: () => setTick((t) => t + 1) };
}
