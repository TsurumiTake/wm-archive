import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "../../data/site";
import { useScrolled } from "../../hooks/useScrolled";
import { BgmPlayer } from "../BgmPlayer/BgmPlayer";
import { RandomMomentButton } from "../RandomMomentButton/RandomMomentButton";

export function Navbar() {
  const scrolled = useScrolled();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showMemoryNote, setShowMemoryNote] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" && !location.hash;
    if (path.startsWith("/#")) return location.pathname === "/" && location.hash === path.slice(1);
    return location.pathname.startsWith(path);
  };

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname !== "/") return;
    event.preventDefault();
    setShowMemoryNote(true);
    window.setTimeout(() => setShowMemoryNote(false), 2200);
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner shell">
        <Link className="brand brand--hana" to="/" aria-label="返回花与爱丽丝首页" onClick={handleBrandClick}>
          <span className="brand__mark chinese">花与爱丽丝</span>
          <span className="brand__word english">HANA &amp; ALICE</span>
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {siteConfig.navigation.map((item) => (
            <Link key={item.path} className={`nav-link ${isActive(item.path) ? "is-active" : ""}`} to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <BgmPlayer />
          <RandomMomentButton className="site-header__random" label="RANDOM" />
          <button
            className="menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "关闭导航菜单" : "打开导航菜单"}
            onClick={() => setOpen((current) => !current)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-navigation" className={`mobile-nav ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-nav__backdrop" aria-hidden="true" />
        <nav aria-label="手机导航">
          {siteConfig.navigation.map((item, index) => (
            <Link
              key={item.path}
              className={`mobile-nav__link ${isActive(item.path) ? "is-active" : ""}`}
              style={{ "--nav-index": index } as CSSProperties}
              to={item.path}
              tabIndex={open ? 0 : -1}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
          <RandomMomentButton
            className="mobile-nav__random"
            label="随便翻一页"
            onNavigate={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          />
        </nav>
      </div>

      <div className={`memory-note english ${showMemoryNote ? "is-visible" : ""}`} aria-live="polite">
        some moments are worth keeping.
      </div>
    </header>
  );
}
