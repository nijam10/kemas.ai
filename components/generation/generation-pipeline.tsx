"use client";

import { useEffect, useState } from "react";
import { FileText, Globe, Server, Workflow, Layers, Image, Package, Box, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineNode {
  id: number;
  label: string;
  description: string;
  icon: React.ElementType;
  duration: number; // seconds
}

const pipelineNodes: PipelineNode[] = [
  {
    id: 1,
    label: "Prompt + Logo",
    description: "User prompt, packaging type, and brand logo",
    icon: FileText,
    duration: 1.5,
  },
  {
    id: 2,
    label: "Next.js App",
    description: "Sends request securely to backend API",
    icon: Globe,
    duration: 1,
  },
  {
    id: 3,
    label: "API Gateway",
    description: "Validates session, credits, and request payload",
    icon: Server,
    duration: 2,
  },
  {
    id: 4,
    label: "ComfyUI Pipeline",
    description: "Runs the packaging generation workflow",
    icon: Workflow,
    duration: 5,
  },
  {
    id: 5,
    label: "Kemas.ai LoRA",
    description: "Applies premium packaging visual style",
    icon: Layers,
    duration: 4,
  },
  {
    id: 6,
    label: "Logo Compositing",
    description: "Places uploaded logo precisely on the design",
    icon: Image,
    duration: 3,
  },
  {
    id: 7,
    label: "Generated Image",
    description: "Returns packaging result to the preview area",
    icon: Package,
    duration: 2,
  },
  {
    id: 8,
    label: "3D Preview Ready",
    description: "Result can be opened in interactive mockup view",
    icon: Box,
    duration: 1.5,
  },
];

interface GenerationPipelineProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function GenerationPipeline({ isActive, onComplete }: GenerationPipelineProps) {
  const [activeNode, setActiveNode] = useState(0);
  const [completedNodes, setCompletedNodes] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) {
      setActiveNode(0);
      setCompletedNodes([]);
      return;
    }

    let cumulativeTime = 0;
    const timers: NodeJS.Timeout[] = [];

    pipelineNodes.forEach((node, index) => {
      cumulativeTime += node.duration;

      // Set node as active
      const activeTimer = setTimeout(() => {
        setActiveNode(node.id);
      }, (cumulativeTime - node.duration) * 1000);

      // Set node as completed
      const completeTimer = setTimeout(() => {
        setCompletedNodes((prev) => [...prev, node.id]);
        
        // If last node, trigger completion
        if (index === pipelineNodes.length - 1) {
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }
      }, cumulativeTime * 1000);

      timers.push(activeTimer, completeTimer);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [isActive, onComplete]);

  const getNodeState = (nodeId: number) => {
    if (completedNodes.includes(nodeId)) return "completed";
    if (activeNode === nodeId) return "active";
    return "pending";
  };

  return (
    <div className="bg-white border border-[#E5E4E0] rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">
          Live Generation Flow
        </h3>
        <p className="text-sm text-[#737373]">
          {isActive 
            ? "Watch how your prompt moves through the Kemas.ai generation pipeline"
            : "The generation pipeline will activate when you click Generate"}
        </p>
      </div>

      {/* Desktop: Horizontal Flow */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Connecting Lines */}
          <div className="absolute top-[52px] left-0 right-0 h-0.5 bg-[#E5E4E0]">
            {isActive && (
              <div
                className="h-full bg-gradient-to-r from-[#F97316] to-[#FACC15] transition-all duration-500"
                style={{
                  width: `${(completedNodes.length / pipelineNodes.length) * 100}%`,
                }}
              />
            )}
          </div>

          {/* Nodes */}
          <div className="grid grid-cols-4 gap-4">
            {pipelineNodes.map((node, index) => {
              const state = getNodeState(node.id);
              const Icon = node.icon;

              return (
                <div key={node.id} className="relative">
                  <div
                    className={cn(
                      "relative z-10 bg-white border-2 rounded-xl p-4 transition-all duration-300",
                      state === "active" && "border-[#F97316] shadow-lg shadow-[#F97316]/20",
                      state === "completed" && "border-[#FACC15] bg-[#FACC15]/5",
                      state === "pending" && "border-[#E5E4E0] opacity-50"
                    )}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                          state === "active" && "bg-[#F97316]/10 text-[#F97316]",
                          state === "completed" && "bg-[#FACC15]/10 text-[#FACC15]",
                          state === "pending" && "bg-[#E5E4E0] text-[#A3A3A3]"
                        )}
                      >
                        {state === "completed" ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={cn(
                            "text-sm font-semibold mb-1",
                            state === "active" && "text-[#F97316]",
                            state === "completed" && "text-[#1A1A1A]",
                            state === "pending" && "text-[#737373]"
                          )}
                        >
                          {node.label}
                        </h4>
                        {state === "active" && (
                          <span className="text-xs font-medium text-[#F97316]">
                            Running...
                          </span>
                        )}
                        {state === "completed" && (
                          <span className="text-xs font-medium text-[#FACC15]">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-[#737373] leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="lg:hidden space-y-3">
        {pipelineNodes.map((node, index) => {
          const state = getNodeState(node.id);
          const Icon = node.icon;
          const isLast = index === pipelineNodes.length - 1;

          return (
            <div key={node.id} className="relative">
              {/* Connecting Line */}
              {!isLast && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-[#E5E4E0] -mb-3">
                  {completedNodes.includes(node.id) && (
                    <div className="w-full h-full bg-gradient-to-b from-[#F97316] to-[#FACC15]" />
                  )}
                </div>
              )}

              {/* Node */}
              <div
                className={cn(
                  "relative z-10 flex items-start gap-3 p-4 bg-white border-2 rounded-xl transition-all duration-300",
                  state === "active" && "border-[#F97316] shadow-lg shadow-[#F97316]/20",
                  state === "completed" && "border-[#FACC15] bg-[#FACC15]/5",
                  state === "pending" && "border-[#E5E4E0] opacity-50"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    state === "active" && "bg-[#F97316]/10 text-[#F97316]",
                    state === "completed" && "bg-[#FACC15]/10 text-[#FACC15]",
                    state === "pending" && "bg-[#E5E4E0] text-[#A3A3A3]"
                  )}
                >
                  {state === "completed" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={cn(
                        "text-sm font-semibold",
                        state === "active" && "text-[#F97316]",
                        state === "completed" && "text-[#1A1A1A]",
                        state === "pending" && "text-[#737373]"
                      )}
                    >
                      {node.label}
                    </h4>
                    {state === "active" && (
                      <span className="text-xs font-medium text-[#F97316]">
                        Running...
                      </span>
                    )}
                    {state === "completed" && (
                      <span className="text-xs font-medium text-[#FACC15]">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#737373] leading-relaxed">
                    {node.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
