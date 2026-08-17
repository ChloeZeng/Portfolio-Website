import "./App.css";
import HorizontalStory from "./components/HorizontalStory";
import WorkGallery     from "./components/WorkGallery";
import Footer          from "./components/Footer";

/*
  Page structure:
  1. HorizontalStory  — cinematic 3-panel story with video background (350vh)
  2. WorkGallery      — compact project cards, "Selected Work"
  3. Footer           — bio, contact links
*/
function App() {
  return (
    <div className="app">
      <HorizontalStory />
      <WorkGallery />
      <Footer />
    </div>
  );
}

export default App;
