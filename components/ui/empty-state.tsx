import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Image,
  History,
  CreditCard,
  Sparkles,
  FolderOpen,
  Users,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Package,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-[#F97316]" />
      </div>
      <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{title}</h3>
      <p className="text-sm text-[#737373] max-w-md mb-6">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="px-6 py-3 bg-[#F97316] text-white font-semibold rounded-xl hover:bg-[#EA580C] transition-colors"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-[#F97316] text-white font-semibold rounded-xl hover:bg-[#EA580C] transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </motion.div>
  );
}

// Specific Empty States for common scenarios

export function EmptyGallery() {
  return (
    <EmptyState
      icon={Image}
      title="No Designs Yet"
      description="Your gallery is empty. Start creating beautiful packaging designs to see them here."
      actionLabel="Create First Design"
      actionHref="/generate"
    />
  );
}

export function EmptyHistory() {
  return (
    <EmptyState
      icon={History}
      title="No Generation History"
      description="You haven't generated any designs yet. Your generation history will appear here once you start creating."
      actionLabel="Start Generating"
      actionHref="/generate"
    />
  );
}

export function EmptyCredits() {
  return (
    <EmptyState
      icon={CreditCard}
      title="No Credits Available"
      description="You've run out of credits. Contact admin to top up your account and continue creating amazing designs."
      actionLabel="View Profile"
      actionHref="/profile"
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      icon={FolderOpen}
      title="No Results Found"
      description="We couldn't find any designs matching your search. Try different keywords or filters."
    />
  );
}

export function EmptyDashboard() {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl p-12">
      <EmptyState
        icon={Sparkles}
        title="Welcome to Kemas.ai"
        description="Start your packaging design journey by creating your first AI-generated design. It only takes a few seconds!"
        actionLabel="Create Your First Design"
        actionHref="/generate"
      />
    </div>
  );
}

export function EmptyAdminUsers() {
  return (
    <EmptyState
      icon={Users}
      title="No Users Found"
      description="No users match your search criteria. Try adjusting your filters or search query."
    />
  );
}

export function EmptyAdminModeration() {
  return (
    <EmptyState
      icon={ShieldCheck}
      title="All Clear!"
      description="There are no items pending moderation at the moment. Great job keeping the platform clean!"
    />
  );
}

// Compact Empty State (for smaller sections)
export function CompactEmptyState({
  icon: Icon = Package,
  message,
}: {
  icon?: LucideIcon;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F97316]/10 to-[#FACC15]/10 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-[#F97316]" />
      </div>
      <p className="text-sm text-[#737373]">{message}</p>
    </div>
  );
}

// Empty State with Illustration (for landing sections)
export function IllustratedEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      {/* Minimalist Illustration */}
      <div className="relative w-48 h-48 mb-8">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#F97316]/20 to-[#FACC15]/20 flex items-center justify-center">
            <Package className="w-16 h-16 text-[#F97316]" />
          </div>
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border-2 border-[#F97316]/20"
        />
      </div>

      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">{title}</h2>
      <p className="text-base text-[#737373] max-w-lg mb-8">{description}</p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-8 py-4 bg-[#F97316] text-white font-semibold rounded-xl hover:bg-[#EA580C] transition-all hover:scale-105"
        >
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
