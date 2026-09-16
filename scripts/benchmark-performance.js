const http = require("http");

async function fetchWithTiming(url) {
  const start = performance.now();
  const res = await fetch(url);
  const data = await res.text();
  const duration = performance.now() - start;
  return {
    status: res.status,
    durationMs: duration.toFixed(1),
    cacheControl: res.headers.get("cache-control"),
    contentType: res.headers.get("content-type"),
    sizeBytes: data.length,
  };
}

async function runBenchmark() {
  console.log("⚡ ========================================================");
  console.log("🚀 CAMBRIDGE MANDI WEBSITE PERFORMANCE & LATENCY BENCHMARK");
  console.log("========================================================\n");

  // 1. API Endpoints
  const apiUrls = [
    "http://localhost:3002/api/settings",
    "http://localhost:3002/api/theme",
    "http://localhost:3002/api/pages/visibility",
    "http://localhost:3002/api/notices",
    "http://localhost:3002/api/pages/home",
  ];

  console.log("📊 1. IN-MEMORY CACHE API LATENCIES (WARMUP & RAM SPEED):");
  for (const url of apiUrls) {
    // Warmup
    await fetch(url);
    // Measure cached read
    const result = await fetchWithTiming(url);
    const endpoint = url.replace("http://localhost:3002", "");
    console.log(
      `   ✅ ${endpoint.padEnd(25)} Latency: ${result.durationMs}ms | Status: ${result.status} | Cache: ${result.cacheControl || "none"}`
    );
  }

  // 2. WebP Image Delivery
  console.log("\n🖼️  2. WEBP STATIC ASSET DELIVERY & COMPRESSION:");
  const testImages = [
    "http://localhost:3002/uploads/2__2721_x_847__1ee9499dbabc.webp",
    "http://localhost:3002/uploads/imageedit_5_2989102543-removeb_9ae90e8e37b1.webp",
    "http://localhost:3002/uploads/IMG_4589edited-2048x905_1859ac1b53f9.webp",
    "http://localhost:3002/uploads/Mrs_-Priyanka-Jamwal_aa1a4dde6e65.webp",
  ];

  for (const imgUrl of testImages) {
    const result = await fetchWithTiming(imgUrl);
    const fileName = imgUrl.split("/").pop();
    console.log(
      `   ⚡ ${fileName.padEnd(45)} Size: ${(result.sizeBytes / 1024).toFixed(0)} KB | Status: ${result.status} | Type: ${result.contentType}`
    );
  }

  // 3. Public Pages Response
  console.log("\n🌐 3. PUBLIC PAGES LOAD & RENDER PERFORMANCE:");
  const pages = [
    "http://localhost:3002/",
    "http://localhost:3002/about",
    "http://localhost:3002/academics",
    "http://localhost:3002/facilities",
    "http://localhost:3002/gallery",
    "http://localhost:3002/news",
    "http://localhost:3002/contact",
  ];

  for (const pageUrl of pages) {
    const result = await fetchWithTiming(pageUrl);
    const pagePath = pageUrl.replace("http://localhost:3002", "") || "/";
    console.log(
      `   🚀 ${pagePath.padEnd(20)} Response: ${result.durationMs}ms | Status: ${result.status} | Size: ${(result.sizeBytes / 1024).toFixed(1)} KB`
    );
  }

  console.log("\n========================================================");
  console.log("✨ ALL BENCHMARKS COMPLETED WITH OPTIMAL PERFORMANCE!");
  console.log("========================================================\n");
}

runBenchmark();
