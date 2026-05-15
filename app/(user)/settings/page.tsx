export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">Settings</h1>
        <p className="text-[#737373]">Manage your account and billing</p>
      </div>

      {/* TODO: Implement settings sections */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#E5E4E0] p-8">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Profile Settings</h2>
          <p className="text-sm text-[#737373]">Profile settings will be implemented here</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E4E0] p-8">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Billing & Credits</h2>
          <p className="text-sm text-[#737373]">Billing management will be implemented here</p>
        </div>
      </div>
    </div>
  );
}
