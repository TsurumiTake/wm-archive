import { useBookmarks } from "../../hooks/useBookmarks";

export function BookmarkButton({ momentId, title }: { momentId: string; title: string }) {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const active = bookmarks.includes(momentId);

  return (
    <button
      className={`bookmark-button ${active ? "is-active" : ""}`}
      type="button"
      aria-pressed={active}
      aria-label={active ? `取消收藏：${title}` : `收藏这一页：${title}`}
      title={active ? "取消收藏" : "夹进相册"}
      onClick={() => toggleBookmark(momentId)}
    >
      <span aria-hidden="true">{active ? "◆" : "◇"}</span>
    </button>
  );
}
