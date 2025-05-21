import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Component/Navbar';

const Drawboard = () => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const startDrawing = (e) => {
        setIsDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setCurrentLine([{ x: offsetX, y: offsetY }]);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        setCurrentLine(prev => [...prev, { x: offsetX, y: offsetY }]);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setLines(prev => [...prev, currentLine]);
            setCurrentLine([]);
            setIsDrawing(false);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const drawLine = (line) => {
            if (line.length < 2) return;
            ctx.beginPath();
            ctx.moveTo(line[0].x, line[0].y);
            for (let i = 1; i < line.length; i++) {
                ctx.lineTo(line[i].x, line[i].y);
            }
            ctx.stroke();
        };

        lines.forEach(drawLine);
        drawLine(currentLine);
    }, [lines, currentLine]);

    const clearCanvas = () => {
        setLines([]);
        setCurrentLine([]);
    };

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <Navbar isOpen={isNavOpen} toggleNavbar={() => setIsNavOpen(!isNavOpen)} />

            <main className={`transition-all duration-300 ${isNavOpen ? 'ml-64' : 'ml-20'}`}>
                <div className="flex flex-col items-center p-4">
                    <h1 className="text-2xl font-bold text-white mb-4">Drawboard</h1>

                    <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={600}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            className="bg-white cursor-crosshair"
                        />
                    </div>

                    <button
                        onClick={clearCanvas}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Clear Canvas
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Drawboard;
