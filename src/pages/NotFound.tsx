import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";

export function NotFound() {
  usePageMeta("没有找到这一页｜花与爱丽丝");

  return (
    <main className="not-found">
      <div className="not-found__code">404 · 记录不存在</div>
      <h1>这条记录暂时没有找到。</h1>
      <p>页面可能已经移动，或者这条内容还没有被添加。</p>
      <Link className="button button--solid" to="/">
        返回首页 <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
