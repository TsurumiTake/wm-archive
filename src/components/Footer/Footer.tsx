import { Link } from "react-router-dom";
import { siteConfig } from "../../data/site";
import { LanguageText } from "../ui/LanguageText";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__statement shell">
        <span className="site-footer__mark chinese">花</span>
        <div>
          <h2>花与爱丽丝</h2>
          <p><LanguageText text="她们之间的一些小事。" /></p>
          <em className="japanese" aria-hidden="true">「あの日のふたり。」</em>
        </div>
      </div>

      <div className="site-footer__top shell">
        <p className="english">HANA &amp; ALICE / W×M MOMENTS</p>
        <div className="site-footer__links">
          {siteConfig.navigation.map((item) => (
            <Link key={item.path} to={item.path}>{item.label}</Link>
          ))}
        </div>
      </div>

      <div className="site-footer__bottom shell">
        <p><LanguageText text="W×M MOMENTS · PHOTO DIARY" /></p>
        <p><LanguageText text="WONI × MINAMI" /></p>
      </div>
    </footer>
  );
}
