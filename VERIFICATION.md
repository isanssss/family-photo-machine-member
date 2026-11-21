# Verification Record

Verified end to end on 2026-11-21 by running the entry program in a fresh
temporary directory containing only `main.ts` and the three base64 photo
parts (`photo-part-1.b64`, `photo-part-2.b64`, `photo-part-3.b64`).

## What was run

```
node --experimental-strip-types main.ts
```

Run twice; each run wrote `/output/entry.png`.

## Check results

- **Byte size:** 212,835 bytes — within the 1,048,576-byte limit. PASS
- **Format:** JPEG. Head magic bytes `FF D8 FF E0` (SOI + JFIF APP0);
  file ends with `FF D9` (EOI). PASS
- **Dimensions:** 1024 × 1024 pixels (from the JPEG SOF marker). PASS
- **Byte identity:** output is byte-identical (`cmp`, no differences) to
  the source photograph `family-photo/entry.jpg`. PASS
- **Determinism:** the second run produced bytes identical to the first
  run (`cmp`, no differences). PASS
