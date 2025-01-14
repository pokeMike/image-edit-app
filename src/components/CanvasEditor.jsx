import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { Button } from 'react-bootstrap';

function CanvasEditor({ imageUrl, onBack }) {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      width: 700,
      height: 500,
    });
    fabricCanvas.current = canvas;

    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        const scaleFactor = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );

        img.set({
          left: (canvas.width - img.width * scaleFactor) / 2,
          top: (canvas.height - img.height * scaleFactor) / 2,
          scaleX: scaleFactor,
          scaleY: scaleFactor,
        });

        canvas.add(img);
        canvas.sendToBack(img);

        logCanvasLayers();
      },
      { crossOrigin: 'anonymous' }
    );

    return () => {
      canvas.dispose();
    };
  }, [imageUrl]);

  const addText = () => {
    const canvas = fabricCanvas.current;
    if (canvas) {
      const text = new fabric.Textbox('Your Text Here', {
        left: 50,
        top: 50,
        width: 200,
        fontSize: 20,
        fill: '#000',
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      logCanvasLayers();
    }
  };

  const addShape = (shapeType) => {
    const canvas = fabricCanvas.current;

    let shape;
    if (shapeType === 'rectangle') {
      shape = new fabric.Rect({
        left: canvas.width / 4,
        top: canvas.height / 4,
        width: 100,
        height: 100,
        fill: 'rgba(255, 0, 0, 0.5)',
      });
    } else if (shapeType === 'circle') {
      shape = new fabric.Circle({
        left: canvas.width / 2,
        top: canvas.height / 2,
        radius: 50,
        fill: 'rgba(0, 0, 255, 0.5)',
      });
    } else if (shapeType === 'triangle') {
      shape = new fabric.Triangle({
        left: canvas.width / 3,
        top: canvas.height / 3,
        width: 100,
        height: 100,
        fill: 'rgba(0, 255, 0, 0.5)',
      });
    } else if (shapeType === 'polygon') {
      const points = [
        { x: 0, y: -50 },
        { x: 50, y: 50 },
        { x: 0, y: 100 },
        { x: -50, y: 50 },
      ];
      shape = new fabric.Polygon(points, {
        left: canvas.width / 2,
        top: canvas.height / 2,
        fill: 'rgba(128, 0, 128, 0.5)',
        stroke: 'purple',
        strokeWidth: 2,
      });
    }

    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      logCanvasLayers();
    }
  };

  const downloadCanvas = () => {
    const canvas = fabricCanvas.current;
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });

      const link = document.createElement('a');
      link.download = 'canvas.png';
      link.href = dataURL;
      link.click();

      logCanvasLayers();
    }
  };

  const logCanvasLayers = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    const layers = canvas.getObjects().map((obj) => {
      const { type, left, top, width, height, scaleX, scaleY, fill, text } =
        obj.toObject();
      return {
        type,
        position: { left, top },
        size: { width, height },
        scale: { scaleX, scaleY },
        fill,
        text: text || null,
      };
    });

    console.log('Canvas Layers:', layers);
  };

  return (
    <div className="canvas_container">
      <Button
        variant="secondary"
        className="mb-3"
        onClick={onBack}
        style={{ position: 'absolute', top: '10px', left: '10px' }}
      >
        Back to Search
      </Button>
      <canvas ref={canvasRef}></canvas>
      <div className="buttons btn-container">
        <h1>Add Captions</h1>
        <ul>
          <li className="listed">
            <Button onClick={addText}>Text</Button>
          </li>
          <li className="listed">
            <Button onClick={() => addShape('rectangle')}>Rectangle</Button>
          </li>
          <li className="listed">
            <Button onClick={() => addShape('circle')}>Circle</Button>
          </li>
          <li className="listed">
            <Button onClick={() => addShape('triangle')}>Triangle</Button>
          </li>
          <li className="listed">
            <Button onClick={() => addShape('polygon')}>Polygon</Button>
          </li>
          <li className="listed">
            <Button onClick={downloadCanvas}>Download Image</Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CanvasEditor;
