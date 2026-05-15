"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import AuthNavbar from "@/components/layout/auth-navbar";
import {
  User,
  Building,
  Package,
  Save,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { updateProfile } from "@/lib/api-client";

// ── Form state type ───────────────────────────────────────────────────────────

interface FormState {
  businessName: string;
  brandCategory: string;
  defaultPackagingType: string;
  defaultExportQuality: string;
  autoSaveGeneratedDesigns: boolean;
}

const DEFAULT_FORM: FormState = {
  businessName: "",
  brandCategory: "Food & Beverages",
  defaultPackagingType: "Standing Pouch",
  defaultExportQuality: "High Resolution",
  autoSaveGeneratedDesigns: true,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { data, loading, refetch } = useProfile();

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Populate form once API data arrives
  useEffect(() => {
    if (!data) return;
    setForm({
      businessName: data.userProfile?.businessName ?? "",
      brandCategory: data.userProfile?.brandCategory ?? "Food & Beverages",
      defaultPackagingType: data.userProfile?.defaultPackagingType ?? "Standing Pouch",
      defaultExportQuality: data.userProfile?.defaultExportQuality ?? "High Resolution",
      autoSaveGeneratedDesigns: data.userProfile?.autoSaveGeneratedDesigns ?? true,
    });
  }, [data]);

  // Derived display values from real session/API
  const userName = data?.user.name ?? "";
  const userEmail = data?.user.email ?? "";
  const userImage = data?.user.image ?? null;
  const userInitial = userName.charAt(0).toUpperCase() || "?";
  const creditBalance = data?.wallet?.balance ?? 0;
  const dailyQuota = data?.wallet?.dailyQuota ?? 40;
  const memberSince = data?.user.createdAt
    ? new Date(data.user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      await updateProfile({
        businessName: form.businessName || undefined,
        brandCategory: form.brandCategory,
        defaultPackagingType: form.defaultPackagingType,
        defaultExportQuality: form.defaultExportQuality,
        autoSaveGeneratedDesigns: form.autoSaveGeneratedDesigns,
      });
      setSaveStatus("success");
      refetch(); // refresh profile data
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      <AuthNavbar />

      <div className="container mx-auto px-6 py-8 max-w-[1400px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm font-medium text-[#737373] hover:text-[#F97316] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
            Profile Settings
          </h1>
          <p className="text-[#737373]">
            Manage your account identity and workspace preferences.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column — Account Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Account Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-[#E5E4E0] rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">
                Account Overview
              </h3>

              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                {loading ? (
                  <div className="w-24 h-24 rounded-full bg-[#F5F5F0] animate-pulse mb-4" />
                ) : userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    width={96}
                    height={96}
                    className="rounded-full object-cover shadow-lg mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F97316] to-[#FACC15] flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                    {userInitial}
                  </div>
                )}

                {loading ? (
                  <>
                    <div className="h-5 w-32 bg-[#F5F5F0] rounded animate-pulse mb-2" />
                    <div className="h-3 w-44 bg-[#F5F5F0] rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <h4 className="text-lg font-bold text-[#1A1A1A] mb-1">{userName}</h4>
                    <p className="text-sm text-[#737373]">{userEmail}</p>
                  </>
                )}
              </div>

              {/* Account Details */}
              <div className="space-y-4 pt-4 border-t border-[#E5E4E0]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#737373]">Account Type</span>
                  <span className="text-sm font-semibold text-[#1A1A1A]">UMKM User</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#737373]">Login Provider</span>
                  <span className="text-sm font-semibold text-[#1A1A1A]">Google</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#737373]">Member Since</span>
                  <span className="text-sm font-semibold text-[#1A1A1A]">{memberSince}</span>
                </div>
              </div>
            </motion.div>

            {/* Credit Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-[#E5E4E0] rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Credit Summary</h3>
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-[#F5F5F0] rounded w-full" />
                  <div className="h-2 bg-[#F5F5F0] rounded w-full" />
                  <div className="h-4 bg-[#F5F5F0] rounded w-1/2" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#737373]">Credits Remaining</span>
                      <span className="text-2xl font-bold text-[#F97316]">{creditBalance}</span>
                    </div>
                    <div className="w-full h-2 bg-[#F5F5F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F97316] to-[#FACC15] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (creditBalance / dailyQuota) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#E5E4E0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#737373]">Daily Quota</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">{dailyQuota} credits</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#737373]">Per Generation</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">10 credits</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column — Forms & Settings */}
          <div className="lg:col-span-8 space-y-6">
            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white border border-[#E5E4E0] rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">Profile Information</h3>

              <div className="space-y-5">
                {/* Full Name — read-only from Google */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A] mb-2">
                    <User className="w-4 h-4 text-[#F97316]" />
                    Full Name
                    <span className="ml-auto text-xs text-[#A3A3A3] font-normal">From Google account</span>
                  </label>
                  <input
                    type="text"
                    value={loading ? "" : userName}
                    readOnly
                    className="w-full px-4 py-3 bg-[#F5F5F0] border border-[#E5E4E0] rounded-xl text-sm text-[#737373] cursor-not-allowed"
                    placeholder="Loading…"
                  />
                </div>

                {/* Business Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A] mb-2">
                    <Building className="w-4 h-4 text-[#F97316]" />
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl text-sm focus:outline-none focus:border-[#F97316] transition-colors disabled:opacity-50"
                    placeholder="e.g. Keripik Nusantara"
                  />
                </div>

                {/* Brand Category */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A] mb-2">
                    <Package className="w-4 h-4 text-[#F97316]" />
                    Brand Category
                  </label>
                  <select
                    value={form.brandCategory}
                    onChange={(e) => setForm({ ...form, brandCategory: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl text-sm focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <option>Food & Beverages</option>
                    <option>Cosmetics</option>
                    <option>Fashion & Beauty</option>
                    <option>Household Essentials</option>
                    <option>Baby & Toys</option>
                    <option>Pet Supplies</option>
                    <option>Electronics</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Workspace Preferences */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white border border-[#E5E4E0] rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-6">Workspace Preferences</h3>

              <div className="space-y-5">
                {/* Default Export Quality */}
                <div>
                  <label className="text-sm font-medium text-[#1A1A1A] mb-2 block">
                    Default Export Quality
                  </label>
                  <select
                    value={form.defaultExportQuality}
                    onChange={(e) => setForm({ ...form, defaultExportQuality: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl text-sm focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <option>High Resolution</option>
                    <option>Standard Resolution</option>
                    <option>Web Optimized</option>
                  </select>
                </div>

                {/* Default Packaging Type */}
                <div>
                  <label className="text-sm font-medium text-[#1A1A1A] mb-2 block">
                    Default Packaging Type
                  </label>
                  <select
                    value={form.defaultPackagingType}
                    onChange={(e) => setForm({ ...form, defaultPackagingType: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl text-sm focus:outline-none focus:border-[#F97316] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <option>Standing Pouch</option>
                    <option>Pillow Pouch</option>
                    <option>Box</option>
                    <option>Jar</option>
                    <option>Bottle</option>
                    <option>Sachet</option>
                  </select>
                </div>

                {/* Auto-save Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#FCFBF7] border border-[#E5E4E0] rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                      Auto-save Generated Designs
                    </p>
                    <p className="text-xs text-[#737373]">
                      Automatically save designs to your history
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setForm({ ...form, autoSaveGeneratedDesigns: !form.autoSaveGeneratedDesigns })
                    }
                    disabled={loading}
                    className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 ${
                      form.autoSaveGeneratedDesigns ? "bg-[#F97316]" : "bg-[#E5E4E0]"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        form.autoSaveGeneratedDesigns ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Save Status Banner */}
            {saveStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-5 py-3 bg-green-50 border border-green-200 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium text-green-700">
                  Profile settings saved successfully.
                </p>
              </motion.div>
            )}

            {saveStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-5 py-3 bg-red-50 border border-red-200 rounded-xl"
              >
                <p className="text-sm font-medium text-red-700">
                  Failed to save settings. Please try again.
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-4"
            >
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#F97316]/90 disabled:bg-[#F97316]/50 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-white border border-[#E5E4E0] hover:bg-[#F5F5F0] text-[#1A1A1A] rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
