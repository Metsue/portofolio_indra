import { useEffect } from "react";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { Navbar, Footer } from "./components/Layout";
import {
  MotionProvider,
  CosmicBackground,
  Preloader,
} from "./components/Effects";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Portfolio } from "./components/Portfolio";
import { Contact } from "./components/Contact";
import { DynamicInteractions, SkillsRibbon } from "./components/Interactions";
import { ProjectDetail } from "./pages/ProjectDetail";
import { basePath, runtime } from "./lib/runtime";
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView({
          behavior:
            document.documentElement.dataset.motion === "true"
              ? "smooth"
              : "instant",
        });
      } else window.scrollTo({ top: 0, behavior: "instant" });
      if (pathname === "/") document.title = "Muhammad Indra — Portfolio";
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
  return null;
}
function Home() {
  return (
    <main id="main-content">
      <Hero />
      <SkillsRibbon />
      <About />
      <Portfolio />
      <Contact />
    </main>
  );
}
export default function App() {
  const Router = runtime.staticSite ? HashRouter : BrowserRouter;
  return (
    <Router basename={runtime.staticSite ? undefined : basePath}>
      <MotionProvider>
        <DynamicInteractions />
        <a className="skip-link" href="#main-content">
          Lewati ke konten
        </a>
        <CosmicBackground />
        <Preloader />
        <Navbar />
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route
            path="*"
            element={
              <main className="container not-found">
                <h1>Halaman tidak ditemukan.</h1>
                <Link className="button primary" to="/">
                  Kembali ke Home
                </Link>
              </main>
            }
          />
        </Routes>
        <Footer />
      </MotionProvider>
    </Router>
  );
}
