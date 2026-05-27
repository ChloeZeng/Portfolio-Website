import "./App.css";
import Hero                 from "./components/Hero";
import MainVideoStory       from "./components/MainVideoStory";
import EndingVideoTransition from "./components/EndingVideoTransition";
import CodeProjectSection   from "./components/CodeProjectSection";
import Footer               from "./components/Footer";

function App() {
  return (
    <div className="app">
      {/* 1. Intro — intro-loop.mp4, autoplay, ~100vh */}
      <Hero />

      {/* 2. Scroll story — main.mp4, scroll-scrubbed, 360vh */}
      <MainVideoStory />

      {/* 3. Ending beat — ending-loop.mp4, autoplay, ~120vh */}
      <EndingVideoTransition />

      {/* 4. Live code projects + footer */}
      <CodeProjectSection />
      <Footer />
    </div>
  );
}

export default App;
