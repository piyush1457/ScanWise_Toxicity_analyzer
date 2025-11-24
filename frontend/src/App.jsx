import React, { useState } from 'react';
import axios from 'axios';
import { Scan, Type, Search } from 'lucide-react';
import Card from './components/Card';
import Button from './components/Button';
import Input from './components/Input';
import Badge from './components/Badge';
import Autocomplete from './components/Autocomplete';
import OCRUploader from './components/OCRUploader';

function App() {
  const [formData, setFormData] = useState({
    product_name: '',
    skin_type: 'Normal',
    skin_tone: 'Medium',
    usage_frequency: 'Daily',
    amount_applied: 'Normal',
    ingredients_list: ''
  });
  const [mode, setMode] = useState('search'); // 'search', 'manual', 'ocr'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductSelect = (product) => {
    setFormData({ ...formData, product_name: product.product_name });
  };

  const handleOCRText = (text) => {
    setFormData({ ...formData, ingredients_list: text });
    setMode('manual'); // Switch to manual to let user edit extracted text
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      ...formData,
      ingredients_list: (mode === 'manual' || mode === 'ocr') ? formData.ingredients_list : null
    };

    try {
      const response = await axios.post('http://localhost:8001/scan-product', payload);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResult(response.data);
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 0.6) return 'text-red-500';
    if (score >= 0.3) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            ScanWise
          </h1>
          <p className="text-muted-foreground text-lg">Advanced Toxicity & Suitability Analyzer</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="Product Details">

              {/* Mode Toggle */}
              <div className="grid grid-cols-3 gap-1 bg-muted p-1 rounded-lg mb-6">
                <button
                  onClick={() => setMode('search')}
                  className={`flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${mode === 'search' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Search className="w-4 h-4 mr-2" /> Search
                </button>
                <button
                  onClick={() => setMode('ocr')}
                  className={`flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${mode === 'ocr' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Scan className="w-4 h-4 mr-2" /> Scan
                </button>
                <button
                  onClick={() => setMode('manual')}
                  className={`flex items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${mode === 'manual' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Type className="w-4 h-4 mr-2" /> Manual
                </button>
              </div>

              {mode === 'search' && (
                <Autocomplete
                  label="Search Product"
                  value={formData.product_name}
                  onChange={handleChange}
                  onSelect={handleProductSelect}
                  placeholder="Type to search (e.g. Nivea)..."
                  name="product_name"
                />
              )}

              {mode === 'ocr' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Upload Ingredient List</label>
                  <OCRUploader onTextExtracted={handleOCRText} />
                </div>
              )}

              {mode === 'manual' && (
                <>
                  <Input
                    label="Product Name (Optional)"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    placeholder="e.g. My Custom Cream"
                  />
                  <Input
                    label="Ingredients List"
                    type="textarea"
                    name="ingredients_list"
                    value={formData.ingredients_list}
                    onChange={handleChange}
                    placeholder="Paste ingredients here..."
                  />
                </>
              )}

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Skin Type</label>
                  <select
                    name="skin_type"
                    value={formData.skin_type}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option>Normal</option>
                    <option>Oily</option>
                    <option>Dry</option>
                    <option>Combination</option>
                    <option>Sensitive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Skin Tone</label>
                  <select
                    name="skin_tone"
                    value={formData.skin_tone}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option>Fair</option>
                    <option>Medium</option>
                    <option>Dark</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency</label>
                    <select
                      name="usage_frequency"
                      value={formData.usage_frequency}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Occasional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <select
                      name="amount_applied"
                      value={formData.amount_applied}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option>Pea</option>
                      <option>Normal</option>
                      <option>Generous</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={handleSubmit} disabled={loading} className="w-full">
                  {loading ? 'Analyzing...' : 'Analyze Product'}
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                  {error}
                </div>
              )}
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-zinc-800 rounded-xl min-h-[400px]">
                <Scan className="w-16 h-16 mb-4 opacity-20" />
                <p>Select a product or scan ingredients to begin analysis.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Score Card */}
                <Card>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">{result.product_name || "Analyzed Product"}</h2>
                      <div className="flex gap-2 mt-3">
                        <Badge variant={result.product_status === 'SAFE' ? 'success' : result.product_status === 'MODERATE' ? 'warning' : 'danger'}>
                          {result.product_status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-6xl font-black tracking-tighter ${getScoreColor(result.product_toxicity_score)}`}>
                        {Math.round(result.product_toxicity_score * 100)}
                      </div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Toxicity Score</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-muted/50 p-6 rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Base Score</div>
                      <div className="font-mono text-2xl font-semibold">{result.detailed_score_breakdown?.base_score || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Usage Factor</div>
                      <div className="font-mono text-2xl font-semibold">x{result.detailed_score_breakdown?.usage_factor || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Ingredients</div>
                      <div className="font-mono text-2xl font-semibold">{result.ingredients.length}</div>
                    </div>
                  </div>
                </Card>

                {/* Suitability Warnings */}
                {(result.not_suitable_for_skin_type.length > 0 || result.not_suitable_for_skin_tone.length > 0) && (
                  <Card title="Suitability Warnings">
                    <div className="space-y-4">
                      {result.not_suitable_for_skin_type.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2">Skin Type Mismatch</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.not_suitable_for_skin_type.map((ing, i) => (
                              <Badge key={i} variant="warning">{ing}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.not_suitable_for_skin_tone.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-muted-foreground uppercase mb-2">Skin Tone Mismatch</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.not_suitable_for_skin_tone.map((ing, i) => (
                              <Badge key={i} variant="warning">{ing}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Ingredient Breakdown */}
                <Card title="Ingredient Analysis">
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {result.toxicity_report.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <span className="font-medium">{item.ingredient}</span>
                        <Badge variant={
                          item.label === 'SAFE' ? 'success' :
                            item.label === 'LOW RISK' ? 'info' :
                              item.label === 'MODERATE RISK' ? 'warning' : 'danger'
                        }>
                          {item.label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
