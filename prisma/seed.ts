/**
 * Kemas.ai Database Seed
 * Populates the database with realistic Indonesian UMKM data
 * Run: npm run prisma:seed
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Build the adapter-backed client directly here.
// We cannot use the @/ alias in tsx (no Next.js resolver),
// and lib/prisma.ts uses a singleton pattern meant for the app runtime.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "\n❌ DATABASE_URL is not set.\n" +
    "   Copy .env.example to .env and fill in your PostgreSQL connection string.\n"
  );
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting Kemas.ai database seed...\n");

  // ============================================================
  // CLEANUP (idempotent re-seed)
  // ============================================================
  console.log("🧹 Cleaning existing seed data...");
  await prisma.adminActionLog.deleteMany();
  await prisma.moderationLog.deleteMany();
  await prisma.generationJob.deleteMany();
  await prisma.design.deleteMany();
  await prisma.uploadedAsset.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.creditWallet.deleteMany();
  await prisma.galleryTemplate.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleanup complete\n");

  // ============================================================
  // TASK 1 — ADMIN USER
  // ============================================================
  console.log("👤 Creating admin user...");
  const admin = await prisma.user.create({
    data: {
      id: "admin-00000000-0000-0000-0000-000000000001",
      name: "Admin Kemas",
      email: "admin@kemas.ai",
      role: "ADMIN",
      status: "ACTIVE",
      businessName: null,
      businessCategory: null,
    },
  });
  console.log(`   ✅ Admin: ${admin.name} (${admin.email})`);

  // ============================================================
  // TASK 2 — 6 UMKM USERS
  // ============================================================
  console.log("\n👥 Creating UMKM users...");
  const usersData = [
    {
      id: "user-00000000-0000-0000-0000-000000000001",
      name: "Khairul Nizam",
      email: "khairul@keripik.com",
      role: "USER" as const,
      status: "ACTIVE" as const,
      businessName: "Keripik Rumah Rasa",
      businessCategory: "Snack Food",
    },
    {
      id: "user-00000000-0000-0000-0000-000000000002",
      name: "Siti Aminah",
      email: "siti@dapoer.com",
      role: "USER" as const,
      status: "ACTIVE" as const,
      businessName: "Dapoer Singkong",
      businessCategory: "Traditional Snacks",
    },
    {
      id: "user-00000000-0000-0000-0000-000000000003",
      name: "Budi Santoso",
      email: "budi@kopinusantara.com",
      role: "USER" as const,
      status: "ACTIVE" as const,
      businessName: "Kopi Aren Nusantara",
      businessCategory: "Coffee & Beverages",
    },
    {
      id: "user-00000000-0000-0000-0000-000000000004",
      name: "Rina Wijaya",
      email: "rina@sambalburina.com",
      role: "USER" as const,
      status: "ACTIVE" as const,
      businessName: "Sambal Bu Rina",
      businessCategory: "Condiments",
    },
    {
      id: "user-00000000-0000-0000-0000-000000000005",
      name: "Ahmad Fauzi",
      email: "ahmad@tehlestari.com",
      role: "USER" as const,
      status: "SUSPENDED" as const,
      businessName: "Teh Organik Lestari",
      businessCategory: "Tea & Beverages",
    },
    {
      id: "user-00000000-0000-0000-0000-000000000006",
      name: "Dewi Lestari",
      email: "dewi@snackbatam.com",
      role: "USER" as const,
      status: "ACTIVE" as const,
      businessName: "Snack Lokal Batam",
      businessCategory: "Snack Food",
    },
  ];

  const users = await Promise.all(
    usersData.map((u) => prisma.user.create({ data: u }))
  );
  users.forEach((u) =>
    console.log(`   ✅ ${u.name} — ${u.businessName} (${u.status})`)
  );

  const [khairul, siti, budi, rina, ahmad, dewi] = users;

  // ============================================================
  // TASK 3 — CREDIT WALLETS
  // ============================================================
  console.log("\n💳 Creating credit wallets...");
  const walletsData = [
    { userId: admin.id,    balance: 999, dailyQuota: 999 },
    { userId: khairul.id,  balance: 40,  dailyQuota: 40  },
    { userId: siti.id,     balance: 35,  dailyQuota: 40  },
    { userId: budi.id,     balance: 20,  dailyQuota: 40  },
    { userId: rina.id,     balance: 0,   dailyQuota: 40  },
    { userId: ahmad.id,    balance: 15,  dailyQuota: 40  },
    { userId: dewi.id,     balance: 40,  dailyQuota: 40  },
  ];

  const wallets = await Promise.all(
    walletsData.map((w) => prisma.creditWallet.create({ data: w }))
  );
  wallets.forEach((w) =>
    console.log(`   ✅ Wallet for userId=${w.userId.slice(-8)} — balance: ${w.balance}`)
  );

  // ============================================================
  // TASK 4 — CREDIT TRANSACTIONS
  // ============================================================
  console.log("\n📊 Creating credit transactions...");
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);
  const hoursAgo = (n: number) => new Date(now.getTime() - n * 3600000);

  const txData = [
    // Khairul — daily reset + 3 usages
    {
      userId: khairul.id,
      amount: 40,
      type: "DAILY_RESET" as const,
      description: "Daily quota reset",
      createdAt: daysAgo(0),
    },
    {
      userId: khairul.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Keripik Singkong Pedas",
      createdAt: hoursAgo(2),
    },
    {
      userId: khairul.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Kopi Aren Premium",
      createdAt: hoursAgo(5),
    },
    {
      userId: khairul.id,
      amount: 50,
      type: "ADMIN_TOPUP" as const,
      description: "Admin top-up by Admin Kemas",
      createdAt: daysAgo(3),
    },
    // Siti — daily reset + 1 usage
    {
      userId: siti.id,
      amount: 40,
      type: "DAILY_RESET" as const,
      description: "Daily quota reset",
      createdAt: daysAgo(0),
    },
    {
      userId: siti.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Kemasan Kue Batik",
      createdAt: hoursAgo(3),
    },
    // Budi — daily reset + 2 usages
    {
      userId: budi.id,
      amount: 40,
      type: "DAILY_RESET" as const,
      description: "Daily quota reset",
      createdAt: daysAgo(0),
    },
    {
      userId: budi.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Sachet Kopi Aren",
      createdAt: hoursAgo(1),
    },
    {
      userId: budi.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Pillow Pouch Kopi",
      createdAt: hoursAgo(4),
    },
    // Rina — all credits used
    {
      userId: rina.id,
      amount: 40,
      type: "DAILY_RESET" as const,
      description: "Daily quota reset",
      createdAt: daysAgo(1),
    },
    {
      userId: rina.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Jar Sambal Pedas",
      createdAt: daysAgo(1),
    },
    {
      userId: rina.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Sambal Matah Bali",
      createdAt: daysAgo(1),
    },
    {
      userId: rina.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Sambal Ijo Padang",
      createdAt: daysAgo(1),
    },
    {
      userId: rina.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Sambal Terasi Premium",
      createdAt: daysAgo(1),
    },
    // Ahmad — suspended, partial usage
    {
      userId: ahmad.id,
      amount: 40,
      type: "DAILY_RESET" as const,
      description: "Daily quota reset",
      createdAt: daysAgo(2),
    },
    {
      userId: ahmad.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Pouch Teh Hijau Organik",
      createdAt: daysAgo(2),
    },
    {
      userId: ahmad.id,
      amount: -10,
      type: "GENERATION_USAGE" as const,
      description: "Generated: Teh Chamomile Premium",
      createdAt: daysAgo(2),
    },
    {
      userId: ahmad.id,
      amount: -5,
      type: "REFUND" as const,
      description: "Refund: generation failed",
      createdAt: daysAgo(2),
    },
    // Dewi — fresh daily reset
    {
      userId: dewi.id,
      amount: 40,
      type: "DAILY_RESET" as const,
      description: "Daily quota reset",
      createdAt: daysAgo(0),
    },
  ];

  await Promise.all(
    txData.map((tx) => prisma.creditTransaction.create({ data: tx }))
  );
  console.log(`   ✅ Created ${txData.length} credit transactions`);

  // ============================================================
  // TASK 5 — GALLERY TEMPLATES
  // ============================================================
  console.log("\n🖼️  Creating gallery templates...");
  const templatesData = [
    {
      title: "Premium Chips",
      slug: "premium-chips",
      description: "Modern minimalist design for premium cassava chips with gold accents and clean typography",
      category: "ARTISAN_SNACK" as const,
      packagingType: "STANDING_POUCH" as const,
      previewImageUrl: "/templates/premium-chips.jpg",
      promptPreset: "Standing pouch untuk keripik singkong premium, desain minimalis modern dengan aksen emas, tipografi bersih, latar belakang krem hangat",
      colorMood: "warm",
      styleTags: ["minimalist", "premium", "modern"],
      isFeatured: true,
    },
    {
      title: "Traditional Batik",
      slug: "traditional-batik",
      description: "Traditional Indonesian batik pattern with cultural heritage elements and warm earth tones",
      category: "TRADITIONAL" as const,
      packagingType: "BOX" as const,
      previewImageUrl: "/templates/batik-box.jpg",
      promptPreset: "Kemasan box dengan motif batik tradisional Indonesia, warna coklat hangat dan emas, elemen budaya Jawa, tipografi klasik",
      colorMood: "warm",
      styleTags: ["traditional", "batik", "cultural"],
      isFeatured: true,
    },
    {
      title: "Organic Green",
      slug: "organic-green",
      description: "Natural organic design with leaf patterns and eco-friendly aesthetics for health products",
      category: "ORGANIC" as const,
      packagingType: "STANDING_POUCH" as const,
      previewImageUrl: "/templates/organic-green.jpg",
      promptPreset: "Standing pouch dengan pola daun organik, warna hijau natural, desain ramah lingkungan, tipografi minimalis",
      colorMood: "cool",
      styleTags: ["organic", "natural", "eco-friendly"],
      isFeatured: true,
    },
    {
      title: "Coffee Premium",
      slug: "coffee-premium",
      description: "Elegant coffee packaging with rich brown tones, gold accents, and premium artisan feel",
      category: "PREMIUM_COFFEE" as const,
      packagingType: "PILLOW_POUCH" as const,
      previewImageUrl: "/templates/coffee-premium.jpg",
      promptPreset: "Pillow pouch untuk kopi aren premium, warna coklat gelap dan emas, tipografi elegan, ilustrasi pohon aren",
      colorMood: "warm",
      styleTags: ["premium", "elegant", "coffee"],
      isFeatured: false,
    },
    {
      title: "Healthy Snack",
      slug: "healthy-snack",
      description: "Fresh and vibrant design for healthy snack products with fruit illustrations",
      category: "HEALTHY_PRODUCTS" as const,
      packagingType: "BOX" as const,
      previewImageUrl: "/templates/healthy-snack.jpg",
      promptPreset: "Kemasan box untuk camilan sehat, warna cerah dan segar, ilustrasi buah-buahan, desain modern bersih",
      colorMood: "vibrant",
      styleTags: ["healthy", "vibrant", "modern"],
      isFeatured: false,
    },
    {
      title: "Artisan Cookies",
      slug: "artisan-cookies",
      description: "Handcrafted artisan cookie packaging with warm homemade feel and vintage typography",
      category: "ARTISAN_SNACK" as const,
      packagingType: "JAR" as const,
      previewImageUrl: "/templates/artisan-cookies.jpg",
      promptPreset: "Kemasan jar untuk kue artisan, warna hangat, nuansa buatan tangan, tipografi vintage, ilustrasi kue tradisional",
      colorMood: "warm",
      styleTags: ["artisan", "handcrafted", "vintage"],
      isFeatured: false,
    },
  ];

  const templates = await Promise.all(
    templatesData.map((t) => prisma.galleryTemplate.create({ data: t }))
  );
  templates.forEach((t) =>
    console.log(`   ✅ Template: "${t.title}" (${t.category}) — featured: ${t.isFeatured}`)
  );

  // ============================================================
  // TASK 6 — SAMPLE GENERATED DESIGNS
  // ============================================================
  console.log("\n🎨 Creating sample designs...");
  const designsData = [
    {
      userId: khairul.id,
      title: "Keripik Singkong Pedas",
      prompt: "Standing pouch untuk keripik singkong pedas manis, warna merah cerah dengan ilustrasi singkong segar, modern minimalist, tipografi bold",
      packagingType: "STANDING_POUCH" as const,
      imageUrl: "/designs/keripik-singkong.jpg",
      thumbnailUrl: "/designs/keripik-singkong-thumb.jpg",
      status: "COMPLETED" as const,
      creditsUsed: 10,
      isSaved: true,
      createdAt: hoursAgo(2),
    },
    {
      userId: khairul.id,
      title: "Kopi Aren Premium",
      prompt: "Pillow pouch untuk kopi aren premium, warna coklat gelap dengan aksen emas, ilustrasi pohon aren, elegan dan mewah",
      packagingType: "PILLOW_POUCH" as const,
      imageUrl: "/designs/kopi-aren.jpg",
      thumbnailUrl: "/designs/kopi-aren-thumb.jpg",
      status: "COMPLETED" as const,
      creditsUsed: 10,
      isSaved: true,
      createdAt: hoursAgo(5),
    },
    {
      userId: siti.id,
      title: "Kemasan Kue Batik",
      prompt: "Box packaging untuk kue tradisional, tema batik modern dengan warna coklat dan emas, motif Jawa klasik",
      packagingType: "BOX" as const,
      imageUrl: "/designs/kue-batik.jpg",
      thumbnailUrl: "/designs/kue-batik-thumb.jpg",
      status: "COMPLETED" as const,
      creditsUsed: 10,
      isSaved: true,
      createdAt: hoursAgo(3),
    },
    {
      userId: budi.id,
      title: "Sachet Kopi Aren",
      prompt: "Kemasan sachet kopi aren premium, minimalis elegan dengan ilustrasi pohon aren, warna coklat dan krem",
      packagingType: "SACHET" as const,
      imageUrl: "/designs/sachet-kopi.jpg",
      thumbnailUrl: "/designs/sachet-kopi-thumb.jpg",
      status: "COMPLETED" as const,
      creditsUsed: 10,
      isSaved: false,
      createdAt: hoursAgo(1),
    },
    {
      userId: rina.id,
      title: "Jar Sambal Pedas",
      prompt: "Kemasan jar untuk sambal pedas Bu Rina, warna merah dengan ilustrasi cabai segar, traditional Indonesian style",
      packagingType: "JAR" as const,
      imageUrl: "/designs/sambal-jar.jpg",
      thumbnailUrl: "/designs/sambal-jar-thumb.jpg",
      status: "COMPLETED" as const,
      creditsUsed: 10,
      isSaved: true,
      createdAt: daysAgo(1),
    },
    {
      userId: ahmad.id,
      title: "Pouch Teh Hijau Organik",
      prompt: "Standing pouch untuk teh hijau organik, warna hijau natural dengan ilustrasi daun teh, eco-friendly design",
      packagingType: "STANDING_POUCH" as const,
      imageUrl: "/designs/teh-hijau.jpg",
      thumbnailUrl: "/designs/teh-hijau-thumb.jpg",
      status: "FLAGGED" as const,
      creditsUsed: 10,
      isSaved: false,
      createdAt: daysAgo(2),
    },
    {
      userId: dewi.id,
      title: "Snack Kacang Mete",
      prompt: "Box packaging untuk kacang mete premium Batam, warna kuning cerah dengan ilustrasi kacang, modern elegant",
      packagingType: "BOX" as const,
      imageUrl: null,
      thumbnailUrl: null,
      status: "PROCESSING" as const,
      creditsUsed: 10,
      isSaved: false,
      createdAt: hoursAgo(0),
    },
  ];

  const designs = await Promise.all(
    designsData.map((d) => prisma.design.create({ data: d }))
  );
  designs.forEach((d) =>
    console.log(`   ✅ Design: "${d.title}" — ${d.status} (${d.packagingType})`)
  );

  // ============================================================
  // TASK 7 — GENERATION JOBS
  // ============================================================
  console.log("\n⚙️  Creating generation jobs...");
  const jobsData = [
    {
      userId: khairul.id,
      designId: designs[0].id,
      status: "COMPLETED" as const,
      currentStep: "OUTPUT_READY" as const,
      startedAt: hoursAgo(2),
      completedAt: new Date(hoursAgo(2).getTime() + 45000),
      createdAt: hoursAgo(2),
    },
    {
      userId: khairul.id,
      designId: designs[1].id,
      status: "COMPLETED" as const,
      currentStep: "OUTPUT_READY" as const,
      startedAt: hoursAgo(5),
      completedAt: new Date(hoursAgo(5).getTime() + 52000),
      createdAt: hoursAgo(5),
    },
    {
      userId: siti.id,
      designId: designs[2].id,
      status: "COMPLETED" as const,
      currentStep: "OUTPUT_READY" as const,
      startedAt: hoursAgo(3),
      completedAt: new Date(hoursAgo(3).getTime() + 38000),
      createdAt: hoursAgo(3),
    },
    {
      userId: budi.id,
      designId: designs[3].id,
      status: "COMPLETED" as const,
      currentStep: "OUTPUT_READY" as const,
      startedAt: hoursAgo(1),
      completedAt: new Date(hoursAgo(1).getTime() + 41000),
      createdAt: hoursAgo(1),
    },
    {
      userId: rina.id,
      designId: designs[4].id,
      status: "COMPLETED" as const,
      currentStep: "OUTPUT_READY" as const,
      startedAt: daysAgo(1),
      completedAt: new Date(daysAgo(1).getTime() + 47000),
      createdAt: daysAgo(1),
    },
    {
      userId: ahmad.id,
      designId: designs[5].id,
      status: "FAILED" as const,
      currentStep: "COMFYUI_PIPELINE" as const,
      errorMessage: "ComfyUI pipeline timeout after 120 seconds",
      startedAt: daysAgo(2),
      completedAt: new Date(daysAgo(2).getTime() + 120000),
      createdAt: daysAgo(2),
    },
    {
      userId: dewi.id,
      designId: designs[6].id,
      status: "RUNNING" as const,
      currentStep: "COMFYUI_PIPELINE" as const,
      startedAt: hoursAgo(0),
      createdAt: hoursAgo(0),
    },
  ];

  await Promise.all(
    jobsData.map((j) => prisma.generationJob.create({ data: j }))
  );
  console.log(`   ✅ Created ${jobsData.length} generation jobs`);

  // ============================================================
  // TASK 8 — MODERATION LOGS
  // ============================================================
  console.log("\n🛡️  Creating moderation logs...");
  const moderationData = [
    {
      designId: designs[0].id,
      userId: khairul.id,
      adminId: admin.id,
      type: "PROMPT" as const,
      status: "APPROVED" as const,
      reason: null,
      createdAt: hoursAgo(2),
    },
    {
      designId: designs[2].id,
      userId: siti.id,
      adminId: admin.id,
      type: "PROMPT" as const,
      status: "APPROVED" as const,
      reason: null,
      createdAt: hoursAgo(3),
    },
    {
      designId: designs[5].id,
      userId: ahmad.id,
      adminId: admin.id,
      type: "IMAGE" as const,
      status: "FLAGGED" as const,
      reason: "Konten tidak sesuai dengan panduan platform — gambar mengandung elemen yang tidak relevan dengan produk UMKM",
      createdAt: daysAgo(2),
    },
    {
      designId: designs[3].id,
      userId: budi.id,
      adminId: admin.id,
      type: "PROMPT" as const,
      status: "PENDING" as const,
      reason: null,
      createdAt: hoursAgo(1),
    },
    {
      designId: designs[4].id,
      userId: rina.id,
      adminId: admin.id,
      type: "IMAGE" as const,
      status: "APPROVED" as const,
      reason: null,
      createdAt: daysAgo(1),
    },
    {
      designId: designs[6].id,
      userId: dewi.id,
      adminId: admin.id,
      type: "PROMPT" as const,
      status: "PENDING" as const,
      reason: null,
      createdAt: hoursAgo(0),
    },
  ];

  await Promise.all(
    moderationData.map((m) => prisma.moderationLog.create({ data: m }))
  );
  console.log(`   ✅ Created ${moderationData.length} moderation logs`);

  // ============================================================
  // TASK 9 — ADMIN ACTION LOGS
  // ============================================================
  console.log("\n📋 Creating admin action logs...");
  const adminActionsData = [
    {
      adminId: admin.id,
      targetUserId: ahmad.id,
      action: "SUSPEND_USER" as const,
      description: "Akun Ahmad Fauzi (Teh Organik Lestari) ditangguhkan karena pelanggaran panduan konten",
      metadata: { reason: "Konten tidak sesuai panduan", previousStatus: "ACTIVE" },
      createdAt: daysAgo(2),
    },
    {
      adminId: admin.id,
      targetUserId: khairul.id,
      action: "TOPUP_CREDIT" as const,
      description: "Top-up 50 kredit untuk Khairul Nizam (Keripik Rumah Rasa)",
      metadata: { amount: 50, previousBalance: 0, newBalance: 50 },
      createdAt: daysAgo(3),
    },
    {
      adminId: admin.id,
      targetUserId: rina.id,
      action: "RESET_CREDIT" as const,
      description: "Reset kredit harian untuk Rina Wijaya (Sambal Bu Rina)",
      metadata: { dailyQuota: 40, previousBalance: 0, newBalance: 40 },
      createdAt: daysAgo(1),
    },
    {
      adminId: admin.id,
      targetUserId: ahmad.id,
      action: "FLAG_CONTENT" as const,
      description: "Konten desain Ahmad Fauzi ditandai untuk pelanggaran panduan platform",
      metadata: { designId: designs[5].id, reason: "Konten tidak sesuai" },
      createdAt: daysAgo(2),
    },
    {
      adminId: admin.id,
      targetUserId: khairul.id,
      action: "APPROVE_CONTENT" as const,
      description: "Desain Keripik Singkong Pedas milik Khairul Nizam disetujui",
      metadata: { designId: designs[0].id },
      createdAt: hoursAgo(2),
    },
    {
      adminId: admin.id,
      targetUserId: siti.id,
      action: "APPROVE_CONTENT" as const,
      description: "Desain Kemasan Kue Batik milik Siti Aminah disetujui",
      metadata: { designId: designs[2].id },
      createdAt: hoursAgo(3),
    },
  ];

  await Promise.all(
    adminActionsData.map((a) => prisma.adminActionLog.create({ data: a }))
  );
  console.log(`   ✅ Created ${adminActionsData.length} admin action logs`);

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log("\n" + "=".repeat(60));
  console.log("✅ Seed completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`   Users:              ${users.length + 1} (1 admin + ${users.length} UMKM)`);
  console.log(`   Credit Wallets:     ${wallets.length}`);
  console.log(`   Credit Transactions:${txData.length}`);
  console.log(`   Gallery Templates:  ${templates.length}`);
  console.log(`   Designs:            ${designs.length}`);
  console.log(`   Generation Jobs:    ${jobsData.length}`);
  console.log(`   Moderation Logs:    ${moderationData.length}`);
  console.log(`   Admin Action Logs:  ${adminActionsData.length}`);
  console.log("=".repeat(60));
}

main()
  .catch((e) => {
    console.error("\n❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
