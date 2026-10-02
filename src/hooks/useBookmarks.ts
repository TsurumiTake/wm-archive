import { useEffect, useState } from "react";

const STORAGE_KEY = "hana-alice-bookmarks";
const CHANGE_EVENT = "hana-alice-bookmarks-change";

function readBookmarks(): string[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(readBookmarks);

  useEffect(() => {
    const sync = () => setBookmarks(readBookmarks());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleBookmark = (momentId: string) => {
    const next = bookmarks.includes(momentId)
      ? bookmarks.filter((id) => id !== momentId)
      : [...bookmarks, momentId];
    setBookmarks(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return { bookmarks, toggleBookmark };
}
