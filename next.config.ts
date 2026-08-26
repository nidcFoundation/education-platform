import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // This app has been superseded by www.nidcfoundation.com. Permanently
  // redirect every path on the old .org domain over to its equivalent page
  // on .com, preserving deep links instead of dropping everyone on the
  // homepage — this lets each old indexed page transfer its own ranking to
  // its new counterpart rather than losing that association.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "nidcfoundation.org" }],
        destination: "https://www.nidcfoundation.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nidcfoundation.org" }],
        destination: "https://www.nidcfoundation.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
