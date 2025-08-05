// scripts/fix-operationIds.js
const fs = require("fs");
const path = require("path");

// 1. Nustatome swagger failo vietą
const specPath = path.resolve(__dirname, "../spec/openapi.json");

if (!fs.existsSync(specPath)) {
  console.error(
    "❌ spec/openapi.json nerastas – pirma paleisk: npm run api:pull"
  );
  process.exit(1);
}

// 2. Nuskaitome failą
const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
let changed = 0;

// 3. Peržiūrime visus kelius
for (const [url, methods] of Object.entries(spec.paths || {})) {
  for (const [method, op] of Object.entries(methods || {})) {
    const oldId = op.operationId || "";

    // Tik jei operationId yra md5 hash’as (32 simboliai, tik 0-9a-f)
    if (/^[0-9a-f]{32}$/.test(oldId)) {
      // Pvz. "/api/v1/places/{place}" → "getPlacesPlace"
      const clean = url
        .replace(/^\/api\/v\d+\//, "/") // Nuimame /api/v1/
        .replace(/[{}]/g, "") // Pašaliname {param}
        .split("/")
        .filter(Boolean) // Pašaliname tuščius segmentus
        .map((s, i) => (i === 0 ? s : s[0].toUpperCase() + s.slice(1)))
        .join("");

      const newId = method + clean[0].toUpperCase() + clean.slice(1);
      op.operationId = newId;
      changed++;
    }
  }
}

// 4. Išsaugome pakeistą JSON
if (changed > 0) {
  fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));
  console.log(`✔  Pakeista ${changed} md5 operationId(-ų)`);
} else {
  console.log("ℹ  Nieko keisti nereikėjo – operationId jau tvarkingi");
}
