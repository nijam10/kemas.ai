export const dashboardConfig = {
  user: {
    defaultCredits: 40,
    maxHistoryItems: 100,
  },
  generation: {
    maxPromptLength: 500,
    allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    packagingTypes: [
      "Pouch",
      "Box",
      "Bottle",
      "Can",
      "Sachet",
      "Jar",
      "Bag",
      "Wrapper",
    ],
  },
  preview: {
    defaultRotation: 0,
    rotationStep: 45,
  },
};
