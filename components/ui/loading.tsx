import { motion } from "framer-motion";

// Card Skeleton Loader
export function CardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-xl p-6 space-y-4">
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
        className="h-6 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg"
        style={{ backgroundSize: "200% 100%" }}
      />
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
        className="h-4 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg w-3/4"
        style={{ backgroundSize: "200% 100%" }}
      />
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
        className="h-4 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg w-1/2"
        style={{ backgroundSize: "200% 100%" }}
      />
    </div>
  );
}

// Design Card Skeleton (for Gallery/History)
export function DesignCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-xl overflow-hidden">
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
        className="aspect-[4/3] bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0]"
        style={{ backgroundSize: "200% 100%" }}
      />
      <div className="p-4 space-y-3">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
          className="h-5 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg"
          style={{ backgroundSize: "200% 100%" }}
        />
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
          className="h-4 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg w-2/3"
          style={{ backgroundSize: "200% 100%" }}
        />
        <div className="flex gap-2 pt-2">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 0%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
            className="h-9 flex-1 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg"
            style={{ backgroundSize: "200% 100%" }}
          />
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 0%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
            className="h-9 w-9 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-xl p-4 space-y-3">
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
        className="h-4 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg w-1/2"
        style={{ backgroundSize: "200% 100%" }}
      />
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
        className="h-8 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg w-3/4"
        style={{ backgroundSize: "200% 100%" }}
      />
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton() {
  return (
    <tr className="border-b border-[#E5E4E0]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 0%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0]"
            style={{ backgroundSize: "200% 100%" }}
          />
          <div className="space-y-2 flex-1">
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
              className="h-4 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg w-32"
              style={{ backgroundSize: "200% 100%" }}
            />
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
              className="h-3 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg w-24"
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
          className="h-4 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg w-24"
          style={{ backgroundSize: "200% 100%" }}
        />
      </td>
      <td className="px-6 py-4">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
          className="h-4 bg-gradient-to-r from-[#F5F5F0] via-[#E5E4E0] to-[#F5F5F0] rounded-lg w-16"
          style={{ backgroundSize: "200% 100%" }}
        />
      </td>
    </tr>
  );
}

// Full Page Loading Spinner
export function PageLoader() {
  return (
    <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#E5E4E0] border-t-[#F97316] rounded-full mx-auto mb-4"
        />
        <p className="text-sm text-[#737373]">Loading...</p>
      </div>
    </div>
  );
}

// Inline Spinner (for buttons, etc.)
export function Spinner({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-3",
    lg: "w-8 h-8 border-4",
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className={`${sizeClasses[size]} border-white/30 border-t-white rounded-full`}
    />
  );
}

// Pulse Loader (alternative style)
export function PulseLoader() {
  return (
    <div className="flex items-center justify-center gap-2">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
        className="w-3 h-3 bg-[#F97316] rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
        className="w-3 h-3 bg-[#F97316] rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
        className="w-3 h-3 bg-[#F97316] rounded-full"
      />
    </div>
  );
}

// Grid Skeleton (for Gallery/History pages)
export function DesignGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <DesignCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Stats Grid Skeleton (for Dashboard)
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}
