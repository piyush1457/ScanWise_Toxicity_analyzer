import { useState } from "react";
import axios from "axios";

export default function App() {
  const [productName, setProductName] = useState("");
  const [skinType, setSkinType] = useState("dry");
  const [skinTone, setSkinTone] = useState("medium");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanProduct = async () => {
    if (!productName.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:8000/scan-product", {
        product_name: productName,
        skin_type: skinType,
        skin_tone: skinTone,
      });

      if (res.data.error) {
        setResult({ error: res.data.error });
      } else {
        setResult(res.data);
      }

    } catch (err) {
      setResult({ error: "Backend error. Could not connect." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6">
      <div className="w-full max-w-3xl">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          ScanWise – Toxicity Predictor
        </h1>

        {/* INPUT CARD */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <label className="font-semibold text-gray-700">Enter Product Name:</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg mt-1"
            placeholder="e.g., Nivea Soft"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <div className="flex gap-4 mt-4">
            <div className="w-1/2">
              <label className="font-semibold text-gray-700">Skin Type:</label>
              <select
                className="w-full p-3 border rounded-lg mt-1"
                value={skinType}
                onChange={(e) => setSkinType(e.target.value)}
              >
                <option value="dry">Dry</option>
                <option value="oily">Oily</option>
                <option value="sensitive">Sensitive</option>
                <option value="combination">Combination</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="font-semibold text-gray-700">Skin Tone:</label>
              <select
                className="w-full p-3 border rounded-lg mt-1"
                value={skinTone}
                onChange={(e) => setSkinTone(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <button
            onClick={scanProduct}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg mt-5 duration-200"
          >
            {loading ? "Scanning..." : "Scan Product"}
          </button>
        </div>

        {/* ERROR CARD */}
        {result?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mt-6">
            <strong>Error:</strong> {result.error}
          </div>
        )}

        {/* RESULT CARD */}
        {result && !result.error && (
          <div className="bg-white shadow-lg rounded-xl mt-8 p-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Product: {result.product_name}
            </h2>

            {/* PRODUCT STATUS */}
            {result.product_toxicity_score !== undefined && (
              <>
                <p className="text-lg font-semibold mt-2">
                  Toxicity Score:
                  <span className="text-blue-600">
                    {" "}{result.product_toxicity_score.toFixed(2)}
                  </span>
                </p>

                <p className="text-lg font-semibold">
                  Status:
                  <span
                    className={
                      result.product_status === "SAFE"
                        ? "text-green-600"
                        : result.product_status === "MODERATE"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {" "}{result.product_status}
                  </span>
                </p>
              </>
            )}

            {/* INGREDIENTS */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc pl-6 text-gray-700">
                {result.ingredients.map((i, index) => (
                  <li key={index}>{i}</li>
                ))}
              </ul>
            </div>

            {/* TOXICITY REPORT */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Toxicity Report:</h3>
              <ul className="pl-4">
                {result.toxicity_report.map((item, index) => (
                  <li
                    key={index}
                    className={`p-2 rounded-md border mb-2 ${
                      item.label === "TOXIC"
                        ? "bg-red-100 border-red-400"
                        : "bg-green-100 border-green-400"
                    }`}
                  >
                    <strong>{item.ingredient}:</strong> {item.label} (
                    {item.score.toFixed(2)})
                  </li>
                ))}
              </ul>
            </div>

            {/* SKIN TYPE WARNINGS */}
            {result.not_suitable_for_skin_type.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-red-600">
                  Not suitable for your skin type ({skinType}):
                </h3>
                <ul className="list-disc pl-6 text-red-600">
                  {result.not_suitable_for_skin_type.map((i, index) => (
                    <li key={index}>{i}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* SKIN TONE WARNINGS */}
            {result.not_suitable_for_skin_tone.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-orange-600">
                  Not suitable for your skin tone ({skinTone}):
                </h3>
                <ul className="list-disc pl-6 text-orange-600">
                  {result.not_suitable_for_skin_tone.map((i, index) => (
                    <li key={index}>{i}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
