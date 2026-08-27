import type { Metadata } from "next";
import WorkContent from "./WorkContent";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work from ff360_labs — full-stack applications, procedural 3D environments, and creative audio software.",
  alternates: { canonical: "/work" },
};

export default function Work() {
  return <WorkContent />;
}
