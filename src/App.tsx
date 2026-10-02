import { Route, Routes } from "react-router-dom";
import { BackToTop } from "./components/BackToTop/BackToTop";
import { CustomCursor } from "./components/CustomCursor/CustomCursor";
import { Footer } from "./components/Footer/Footer";
import { Navbar } from "./components/Navbar/Navbar";
import { PageTransition } from "./components/PageTransition/PageTransition";
import { ScrollProgress } from "./components/ScrollProgress/ScrollProgress";
import { useScrollToTop } from "./hooks/useScrollToTop";
import { Archive } from "./pages/Archive";
import { Home } from "./pages/Home";
import { MomentCategoryPage } from "./pages/MomentCategoryPage";
import { MomentDetail } from "./pages/MomentDetail";
import { Moments } from "./pages/Moments";
import { NotFound } from "./pages/NotFound";
import { Letter } from "./pages/Letter";

export default function App() {
  useScrollToTop();

  return (
    <div className="app">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <div className="app__content">
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/moments" element={<Moments />} />
            <Route path="/moments/category/:category" element={<MomentCategoryPage />} />
            <Route path="/moments/:id" element={<MomentDetail />} />
            <Route path="/letter" element={<Letter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
}
