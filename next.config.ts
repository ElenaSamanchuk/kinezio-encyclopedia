import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The landing is fully static; the export is also the source for the Tilda build.
  output: "export",
};

export default nextConfig;
