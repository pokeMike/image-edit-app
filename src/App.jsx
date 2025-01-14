import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchPage from './components/SearchPage';
import CanvasEditor from './components/CanvasEditor';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="app-container">
      {selectedImage ? (
        <CanvasEditor
          imageUrl={selectedImage}
          onBack={() => setSelectedImage(null)}
        />
      ) : (
        <SearchPage onImageSelect={(imageUrl) => setSelectedImage(imageUrl)} />
      )}
    </div>
  );
};

export default App;
