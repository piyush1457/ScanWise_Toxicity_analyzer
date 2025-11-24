import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, Loader2, FileText } from 'lucide-react';

const OCRUploader = ({ onTextExtracted }) => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setLoading(true);
        setProgress(0);

        try {
            const result = await Tesseract.recognize(
                file,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.round(m.progress * 100));
                        }
                    }
                }
            );

            onTextExtracted(result.data.text);
        } catch (err) {
            console.error("OCR Error:", err);
            alert("Failed to extract text. Please try a clearer image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer bg-zinc-900/50 hover:bg-zinc-800/50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {loading ? (
                        <>
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
                            <p className="text-sm text-zinc-400">Processing... {progress}%</p>
                        </>
                    ) : preview ? (
                        <div className="relative w-full h-full flex flex-col items-center">
                            <img src={preview} alt="Preview" className="h-32 object-contain mb-2 rounded" />
                            <p className="text-xs text-zinc-500">Click to change image</p>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-10 h-10 text-zinc-500 mb-3 group-hover:text-indigo-400 transition-colors" />
                            <p className="mb-2 text-sm text-zinc-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-zinc-500">PNG, JPG (Max 5MB)</p>
                        </>
                    )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={loading} />
            </label>
        </div>
    );
};

export default OCRUploader;
