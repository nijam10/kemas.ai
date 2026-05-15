export default function PreviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">3D Preview</h1>
        <p className="text-[#737373]">View and download your design</p>
      </div>

      {/* TODO: Implement 3D preview with Three.js */}
      <div className="bg-white rounded-2xl border border-[#E5E4E0] p-8 min-h-[600px] flex items-center justify-center">
        <p className="text-sm text-[#737373]">3D preview will be implemented here</p>
      </div>
    </div>
  );
}
