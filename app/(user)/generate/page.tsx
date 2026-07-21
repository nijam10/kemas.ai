"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, Upload, CheckCircle2, ChevronRight, Box, Image as ImageIcon, 
  Loader2, Download, RefreshCw, Edit3, Check, Layers, AlertCircle, Sparkles
} from "lucide-react";
import AuthNavbar from "@/components/layout/auth-navbar";

// ============================================================================
// STATE MODELS
// ============================================================================

type DisplayState = 
  | "CONFIGURATION"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

// ============================================================================
// MAIN PAGE CONTROLLER
// ============================================================================

export default function GeneratePage() {
  const [displayState, setDisplayState] = useState<DisplayState>("CONFIGURATION");
  const [jobId, setJobId] = useState<string | null>(null);
  
  // Real backend assets
  const [masterWrapperUrl, setMasterWrapperUrl] = useState<string | null>(null);
  const [mockup3dUrl, setMockup3dUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [prompt, setPrompt] = useState("");
  const [packagingType, setPackagingType] = useState("standing-pouch");
  const [productName, setProductName] = useState("");
  const [brandCategory, setBrandCategory] = useState("");
  const [ingredients, setIngredients] = useState("All-purpose flour, cocoa powder,\ngranulated sugar, brown sugar,\nbaking powder, salt, eggs, butter,\nvanilla.");
  const [manufacturerInfo, setManufacturerInfo] = useState("Politeknik Negeri Batam\n+62-812-3456-7890\nhello@polibatam.ac.id\nwww.polibatam.ac.id");
  const [nutritionFact, setNutritionFact] = useState("Calories ........................ 20gr\nTotal Fat ....................... 20gr\nCholesterol ................... 20gr\nSodium .......................... 20gr\nProtein .......................... 20gr");
  const [brandMessage, setBrandMessage] = useState("Choco Crinkle Cookies offer\nthe perfect balance of rich\nchocolate flavor and a\ndelightful texture.");
  const [textColorHex, setTextColorHex] = useState("#332211");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [barcodeFile, setBarcodeFile] = useState<File | null>(null);
  const [maskFile, setMaskFile] = useState<File | null>(null);

  const [isDownloadingAssets, setIsDownloadingAssets] = useState(false);

  // Read URL query parameters for prefilling template data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const presetPrompt = params.get("promptPreset");
      const presetPackaging = params.get("packagingType");
      
      if (presetPrompt) setPrompt(presetPrompt);
      if (presetPackaging) setPackagingType(presetPackaging);
    }
  }, []);

  // Polling Effect
  useEffect(() => {
    if (!jobId || displayState !== "PROCESSING") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/status/${jobId}`);
        const responseData = await res.json();
        
        if (responseData.data?.status === "failed") {
          setErrorMessage(responseData.data?.errorMessage || "Generation failed");
          setDisplayState("FAILED");
          clearInterval(interval);
        } else if (responseData.data?.status === "completed") {
          clearInterval(interval);
          setIsDownloadingAssets(true); // Switch to downloading state
          
          // Preload images so they show up instantly in the next screen
          const urls = [responseData.data?.master_wrapper_url, responseData.data?.front_mockup_url].filter(Boolean);
          
          await Promise.all(
            urls.map(
              (url) =>
                new Promise((resolve) => {
                  const img = new Image();
                  img.src = url;
                  img.onload = resolve;
                  img.onerror = resolve; // Continue even if one fails
                })
            )
          );

          setMasterWrapperUrl(responseData.data?.master_wrapper_url);
          setMockup3dUrl(responseData.data?.front_mockup_url);
          setIsDownloadingAssets(false);
          setDisplayState("COMPLETED");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000); // 1. Reduced polling to 2 seconds for faster response

    return () => clearInterval(interval);
  }, [jobId, displayState]);

  const handleGenerate = async () => {
    if (prompt.trim().length < 10) {
      alert("Prompt must be at least 10 characters");
      return;
    }
    
    setDisplayState("PROCESSING");
    setErrorMessage(null);
    setMasterWrapperUrl(null);
    setMockup3dUrl(null);

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("packaging_type", packagingType);
    formData.append("product_name", productName);
    formData.append("brand_category", brandCategory);
    formData.append("ingredients", ingredients);
    formData.append("nutrition_fact", nutritionFact);
    formData.append("brand_message", brandMessage);
    formData.append("manufacturer_info", manufacturerInfo);
    formData.append("text_color_hex", textColorHex);
    
    if (logoFile) formData.append("logo", logoFile);
    if (barcodeFile) formData.append("barcode", barcodeFile);
    if (maskFile) formData.append("mask", maskFile);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (data.success && data.data.jobId) {
        setJobId(data.data.jobId);
      } else {
        setErrorMessage(data.error || "Failed to start generation");
        setDisplayState("FAILED");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Network error");
      setDisplayState("FAILED");
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#F97316]/20">
      <AuthNavbar />

      <main className="flex-1 flex flex-col relative">
        <StepIndicator currentDisplayState={displayState} />

        <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col">
          <AnimatePresence mode="wait">
            {displayState === "CONFIGURATION" && (
              <ConfigurationScreen 
                key="config" 
                prompt={prompt} setPrompt={setPrompt}
                packagingType={packagingType} setPackagingType={setPackagingType}
                productName={productName} setProductName={setProductName}
                brandCategory={brandCategory} setBrandCategory={setBrandCategory}
                ingredients={ingredients} setIngredients={setIngredients}
                manufacturerInfo={manufacturerInfo} setManufacturerInfo={setManufacturerInfo}
                nutritionFact={nutritionFact} setNutritionFact={setNutritionFact}
                brandMessage={brandMessage} setBrandMessage={setBrandMessage}
                textColorHex={textColorHex} setTextColorHex={setTextColorHex}
                setLogoFile={setLogoFile} setBarcodeFile={setBarcodeFile} setMaskFile={setMaskFile}
                logoFile={logoFile} barcodeFile={barcodeFile} maskFile={maskFile}
                onGenerate={handleGenerate} 
              />
            )}
            
            {displayState === "PROCESSING" && (
              <ProcessingScreen key="processing" isDownloadingAssets={isDownloadingAssets} />
            )}

            {displayState === "COMPLETED" && (
              <FinalResultScreen 
                key="completed" 
                jobId={jobId}
                masterWrapperUrl={masterWrapperUrl}
                mockup3dUrl={mockup3dUrl}
                onNewDesign={() => {
                  setDisplayState("CONFIGURATION");
                  setJobId(null);
                }}
              />
            )}

            {displayState === "FAILED" && (
              <FailedScreen 
                key="failed" 
                errorMessage={errorMessage}
                onRetry={handleGenerate} 
                onBack={() => setDisplayState("CONFIGURATION")}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

function StepIndicator({ currentDisplayState }: { currentDisplayState: DisplayState }) {
  const steps = [
    { state: "CONFIGURATION", label: "Configure" },
    { state: "PROCESSING", label: "Generating" },
    { state: "COMPLETED", label: "Final Assets" },
  ];

  const currentIndex = steps.findIndex(s => s.state === currentDisplayState) >= 0 
    ? steps.findIndex(s => s.state === currentDisplayState) 
    : steps.length - 1; // FAILED fallback

  return (
    <div className="w-full bg-white border-b border-[#E5E4E0] sticky top-0 z-10 hidden sm:block">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step.state} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                    ${isCompleted ? "bg-[#1A1A1A] text-white" : 
                      isCurrent ? "bg-[#F97316] text-white ring-4 ring-[#F97316]/20" : 
                      "bg-[#F5F5F0] text-[#A3A3A3]"}`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-sm font-semibold hidden md:block
                    ${isCurrent ? "text-[#1A1A1A]" : 
                      isCompleted ? "text-[#737373]" : "text-[#A3A3A3]"}`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 lg:w-16 h-px mx-4 transition-colors
                    ${index < currentIndex ? "bg-[#1A1A1A]" : "bg-[#E5E4E0]"}`} 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SCREEN COMPONENTS
// ============================================================================

function ConfigurationScreen(props: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto w-full"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-3">Master Wrapper Configuration</h1>
        <p className="text-[#737373] text-lg max-w-2xl">
          Define your product, upload brand assets, and inject packaging information. We will generate a complete 2D flat wrapper and a 3D Mockup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-[#E5E4E0] shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-[#F97316]" /> Product Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Visual Prompt</label>
                <textarea 
                  value={props.prompt}
                  onChange={(e) => props.setPrompt(e.target.value)}
                  placeholder="Describe the packaging visual style..."
                  className="w-full bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent min-h-[100px] transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Product Name</label>
                  <input type="text" value={props.productName} onChange={(e) => props.setProductName(e.target.value)} className="w-full bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl p-3 focus:ring-2 focus:ring-[#F97316] outline-none" placeholder="e.g. Kopi Tubruk" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Brand Category</label>
                  <input type="text" value={props.brandCategory} onChange={(e) => props.setBrandCategory(e.target.value)} className="w-full bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl p-3 focus:ring-2 focus:ring-[#F97316] outline-none" placeholder="e.g. Beverages" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Packaging Type</label>
                <select 
                  value={props.packagingType}
                  onChange={(e) => props.setPackagingType(e.target.value)}
                  className="w-full bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl p-3 focus:ring-2 focus:ring-[#F97316] outline-none appearance-none cursor-pointer"
                >
                  <option value="standing-pouch">Standing Pouch</option>
                  <option value="pillow-pouch">Pillow Pouch</option>
                  <option value="box">Retail Box</option>
                  <option value="jar">Glass Jar</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-2xl border border-[#E5E4E0] shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-[#F97316]" /> Packaging Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Ingredients</label>
                <textarea value={props.ingredients} onChange={(e) => props.setIngredients(e.target.value)} className="w-full bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl p-3 text-sm h-24 resize-none" placeholder="100% Arabica Beans..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Manufacturer Info</label>
                <textarea value={props.manufacturerInfo} onChange={(e) => props.setManufacturerInfo(e.target.value)} className="w-full bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl p-3 text-sm h-24 resize-none" placeholder="Produced by PT. Kemas AI..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Nutrition Fact</label>
                <textarea value={props.nutritionFact} onChange={(e) => props.setNutritionFact(e.target.value)} className="w-full bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl p-3 text-sm h-24 resize-none" placeholder="Calories..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Brand Message</label>
                <textarea value={props.brandMessage} onChange={(e) => props.setBrandMessage(e.target.value)} className="w-full bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl p-3 text-sm h-24 resize-none" placeholder="Our vision is..." />
              </div>
            </div>
            <div className="mt-5">
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Text Color Hex</label>
                <input type="text" value={props.textColorHex} onChange={(e) => props.setTextColorHex(e.target.value)} className="w-full bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl p-3 focus:ring-2 focus:ring-[#F97316] outline-none" placeholder="#332211" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-2xl border border-[#E5E4E0] shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-[#F97316]" /> Branding Assets
            </h2>
            <div className="space-y-4">
              <label className="border-2 border-dashed border-[#E5E4E0] bg-[#FCFBF7] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#F5F5F0] transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-[#F97316]" />
                </div>
                <p className="font-semibold text-[#1A1A1A]">{props.logoFile ? props.logoFile.name : "Upload Logo (Optional)"}</p>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => props.setLogoFile(e.target.files?.[0] || null)} />
              </label>
              
              <label className="border-2 border-dashed border-[#E5E4E0] bg-[#FCFBF7] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#F5F5F0] transition-colors cursor-pointer group">
                <p className="font-semibold text-[#1A1A1A] text-sm">{props.barcodeFile ? props.barcodeFile.name : "Upload Barcode (Optional)"}</p>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => props.setBarcodeFile(e.target.files?.[0] || null)} />
              </label>

              <label className="border-2 border-dashed border-[#E5E4E0] bg-[#FCFBF7] rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#F5F5F0] transition-colors cursor-pointer group">
                <p className="font-semibold text-[#1A1A1A] text-sm">{props.maskFile ? props.maskFile.name : "Upload Logo Mask (Optional)"}</p>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => props.setMaskFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          </section>

          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] p-6 md:p-8 rounded-2xl shadow-xl border border-[#333]">
            <h3 className="text-white font-bold text-xl mb-2">Ready to Generate</h3>
            <p className="text-[#A3A3A3] text-sm mb-6">
              This process creates both the 2D Master Wrapper and the Seeded 3D Mockup simultaneously.
            </p>
            <button 
              onClick={props.onGenerate}
              className="w-full bg-gradient-to-r from-[#F97316] to-[#FACC15] hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              Start Generation <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProcessingScreen({ isDownloadingAssets }: { isDownloadingAssets?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="flex-1 flex items-center justify-center w-full max-w-2xl mx-auto"
    >
      <div className="w-full bg-white p-10 rounded-3xl border border-[#E5E4E0] shadow-xl text-center">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 rounded-2xl flex items-center justify-center mb-8 relative">
          <Layers className="w-12 h-12 text-[#F97316] animate-pulse" />
          <div className="absolute inset-0 border-4 border-[#F97316]/20 rounded-2xl animate-ping opacity-20" />
        </div>
        
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          {isDownloadingAssets ? "Downloading High-Res Assets..." : "Processing Your Packaging"}
        </h2>
        <p className="text-[#737373] mb-8">
          {isDownloadingAssets 
            ? "Your render is complete! Loading the final assets over the network." 
            : "AI is rendering your 2D wrapper and wrapping it onto a 3D geometry. This may take a few minutes..."}
        </p>

        <div className="flex justify-center mb-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
        </div>
      </div>
    </motion.div>
  );
}

function FinalResultScreen({ masterWrapperUrl, mockup3dUrl, onNewDesign, jobId }: any) {
  const [isUpscaling, setIsUpscaling] = useState(false);

  const forceDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Failed to download via fetch, falling back to open tab", err);
      window.open(url, '_blank');
    }
  };

  const handleDownload2D = async () => {
    if (!masterWrapperUrl) return;
    setIsUpscaling(true);
    try {
      const urlParams = new URLSearchParams(masterWrapperUrl.split('?')[1]);
      const filename = urlParams.get('filename');
      const subfolder = urlParams.get('subfolder') || "";
      const type = urlParams.get('type') || "output";

      const res = await fetch("/api/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, filename, subfolder, folderType: type })
      });
      const data = await res.json();
      
      if (!data.success) throw new Error(data.error);

      // Poll for upscale completion
      const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`/api/status/${jobId}`);
        const statusData = await statusRes.json();
        
        if (statusData.data?.status === "completed") {
          clearInterval(pollInterval);
          setIsUpscaling(false);
          // Trigger download
          if (statusData.data.master_wrapper_url) {
            await forceDownload(statusData.data.master_wrapper_url, `upscaled_2d_${filename}`);
          }
        } else if (statusData.data?.status === "failed") {
          clearInterval(pollInterval);
          setIsUpscaling(false);
          alert("Upscale failed: " + statusData.data.errorMessage);
        }
      }, 3000);
      
    } catch (err: any) {
      setIsUpscaling(false);
      alert("Failed to start upscale: " + err.message);
    }
  };

  const handleDownload3D = async () => {
    if (!mockup3dUrl) return;
    await forceDownload(mockup3dUrl, '3d_mockup.png');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto w-full flex flex-col"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Generation Complete</h1>
          <p className="text-[#737373]">Your packaging assets are ready for download.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleDownload2D}
            disabled={isUpscaling}
            className="px-5 py-2.5 bg-white border border-[#E5E4E0] shadow-sm rounded-xl text-sm font-semibold hover:bg-[#F5F5F0] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isUpscaling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
            {isUpscaling ? "Upscaling to 8K..." : "Download 2D"}
          </button>
          <button 
            onClick={handleDownload3D}
            className="px-5 py-2.5 bg-white border border-[#E5E4E0] shadow-sm rounded-xl text-sm font-semibold hover:bg-[#F5F5F0] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download 3D
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-3xl border border-[#E5E4E0] shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-[#E5E4E0] bg-[#FCFBF7] flex justify-between items-center">
            <div className="font-bold text-[#1A1A1A] text-sm flex items-center gap-2 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-[#F97316]" /> Master Wrapper (2D)
            </div>
            <span className="text-xs text-[#737373] bg-[#F5F5F0] px-2 py-1 rounded">Primary Asset</span>
          </div>
          <div className="flex-1 bg-[#FCFBF7] relative p-6 flex justify-center items-center">
            {masterWrapperUrl ? (
              <img src={masterWrapperUrl} alt="2D Wrapper" className="max-w-full max-h-full object-contain drop-shadow-md" />
            ) : (
                <span className="text-gray-400">No Image Returned</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E5E4E0] shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-[#E5E4E0] bg-[#FCFBF7] flex justify-between items-center">
            <div className="font-bold text-[#1A1A1A] text-sm flex items-center gap-2 uppercase tracking-wider">
              <Box className="w-4 h-4 text-indigo-500" /> 3D Mockup
            </div>
            <span className="text-xs text-[#737373] bg-[#F5F5F0] px-2 py-1 rounded">Visualization</span>
          </div>
          <div className="flex-1 bg-gradient-to-br from-[#F5F5F0] to-[#E5E4E0] relative p-12 flex justify-center items-center">
            {mockup3dUrl ? (
              <img src={mockup3dUrl} alt="3D Mockup" className="max-w-full max-h-full object-contain drop-shadow-2xl scale-90" />
            ) : (
                <span className="text-gray-400">No Image Returned</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={onNewDesign}
          className="px-8 py-4 bg-white border-2 border-[#E5E4E0] hover:border-[#1A1A1A] text-[#1A1A1A] rounded-2xl font-bold transition-all flex items-center gap-2 group"
        >
          <Package className="w-5 h-5 group-hover:scale-110 transition-transform" /> Create New Design
        </button>
      </div>
    </motion.div>
  );
}

function FailedScreen({ onRetry, onBack, errorMessage }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex items-center justify-center w-full max-w-md mx-auto"
    >
      <div className="w-full bg-white p-10 rounded-3xl border border-red-100 shadow-xl text-center">
        <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">Generation Failed</h2>
        <p className="text-sm text-red-500 mb-8">{errorMessage || "Something went wrong"}</p>
        <div className="flex gap-4">
            <button 
            onClick={onBack}
            className="flex-1 px-4 py-3 bg-[#F5F5F0] hover:bg-[#E5E4E0] text-[#1A1A1A] rounded-xl font-bold transition-all"
            >
            Back
            </button>
            <button 
            onClick={onRetry}
            className="flex-1 px-4 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
            <RefreshCw className="w-4 h-4" /> Retry
            </button>
        </div>
      </div>
    </motion.div>
  );
}
