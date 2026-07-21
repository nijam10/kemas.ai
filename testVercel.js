async function checkVercel() {
  try {
    // We cannot pass the auth cookie easily, so it should return 403 Unauthorized
    // If it returns 500, it means it crashes before checking auth or during auth
    const res = await fetch("https://kemas-ai.vercel.app/api/admin/stats");
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (e) {
    console.error(e);
  }
}
checkVercel();
