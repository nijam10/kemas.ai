"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Calendar, Zap, ChevronRight, Download, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import { FadeIn } from "@/components/ui/Animations";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const invoices = [
  { date: "Apr 12, 2026", desc: "Monthly Pro Subscription", amount: "$29.00" },
  { date: "Mar 12, 2026", desc: "Monthly Pro Subscription", amount: "$29.00" },
  { date: "Mar 5, 2026", desc: "Credit Top-Up — 200 Credits", amount: "$19.00" },
  { date: "Feb 12, 2026", desc: "Monthly Pro Subscription", amount: "$29.00" },
  { date: "Jan 12, 2026", desc: "Monthly Pro Subscription", amount: "$29.00" },
];

const weeklyUsage = [
  { label: "Week 1", height: 45 },
  { label: "Week 2", height: 70 },
  { label: "Week 3", height: 55 },
  { label: "Week 4", height: 85 },
];

export default function BillingPage() {
  const [autoRefill, setAutoRefill] = useState(true);

  return (
    <div className="p-8 md:p-10 max-w-[1100px]">
      <FadeIn>
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-brand-navy mb-1">Billing & Subscription</h1>
          <p className="text-zinc-500 text-sm">Manage your plan, credits, and payment methods.</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <FadeIn delay={0.1}>
          <Card glow className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-accent/10 to-transparent rounded-bl-full" />
            <div className="relative">
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold mb-3">Current Plan</p>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-brand-navy">Pro Plan</h3>
                <span className="px-2 py-0.5 bg-brand-accent/10 text-brand-accent text-[10px] font-bold rounded-full">Active</span>
              </div>
              <p className="text-2xl font-bold text-brand-navy mb-4">$29 <span className="text-sm font-normal text-zinc-400">/ month</span></p>
              <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                Change Plan <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.15}>
          <Card className="relative overflow-hidden">
            <div className="relative">
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold mb-3">Next Payment</p>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <h3 className="text-lg font-bold text-brand-navy">May 12, 2026</h3>
              </div>
              <p className="text-xs text-green-600 font-medium mb-4 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Auto-renewal enabled
              </p>
              <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">Renew Now</Button>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card glow className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-50 to-transparent rounded-bl-full" />
            <div className="relative">
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-bold mb-3">AI Generation Credits</p>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-3xl font-bold text-brand-navy">380</span>
                <span className="text-sm text-zinc-400 mb-1">/ 500</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "76%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full"
                />
              </div>
              <Button variant="primary" size="sm" className="w-full rounded-xl text-xs">
                <Zap className="w-3 h-3" />
                Top Up Credits
              </Button>
            </div>
          </Card>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <FadeIn delay={0.25}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-brand-navy">Credit Usage</h2>
              <span className="text-xs text-zinc-400">Last 30 days</span>
            </div>
            <div className="flex items-end justify-between gap-3 h-40 mb-4">
              {weeklyUsage.map((week, i) => (
                <div key={week.label} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${week.height}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                    className="w-full bg-gradient-to-t from-brand-accent to-brand-accent/60 rounded-lg"
                  />
                  <span className="text-[10px] text-zinc-400 font-medium">{week.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400">380 credits used this billing cycle</p>
            <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-brand-navy">Auto-refill Credits</p>
                <p className="text-[11px] text-zinc-400">Add 100 when below 20</p>
              </div>
              <button
                onClick={() => setAutoRefill(!autoRefill)}
                className="text-brand-accent"
              >
                {autoRefill
                  ? <ToggleRight className="w-8 h-8" />
                  : <ToggleLeft className="w-8 h-8 text-zinc-300" />}
              </button>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-brand-navy">Payment Methods</h2>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200/60 bg-zinc-50/50 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-gradient-to-br from-blue-600 to-blue-800 rounded flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">Visa ending in 4010</p>
                  <p className="text-[11px] text-zinc-400">Expires 08/2028</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Default</span>
            </div>
            <Button variant="outline" size="sm" className="w-full rounded-xl text-xs mt-2">
              <Plus className="w-3 h-3" />
              Add New Payment Method
            </Button>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.35}>
        <Card>
          <h2 className="text-base font-bold text-brand-navy mb-6">Invoices</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="text-left text-[11px] text-zinc-400 uppercase tracking-wider font-bold pb-3 pr-4">Date</th>
                  <th className="text-left text-[11px] text-zinc-400 uppercase tracking-wider font-bold pb-3 pr-4">Description</th>
                  <th className="text-left text-[11px] text-zinc-400 uppercase tracking-wider font-bold pb-3 pr-4">Amount</th>
                  <th className="text-right text-[11px] text-zinc-400 uppercase tracking-wider font-bold pb-3">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="py-3.5 pr-4 text-sm text-zinc-600">{inv.date}</td>
                    <td className="py-3.5 pr-4 text-sm text-brand-navy font-medium">{inv.desc}</td>
                    <td className="py-3.5 pr-4 text-sm font-semibold text-brand-navy">{inv.amount}</td>
                    <td className="py-3.5 text-right">
                      <button className="text-brand-accent hover:text-brand-accent-dark transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
