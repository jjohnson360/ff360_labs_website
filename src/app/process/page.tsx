import type { Metadata } from "next";
import ProcessContent from "./ProcessContent";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How a project runs at ff360_labs — four phases from idea to live product: Discover, Design, Build, and Launch, each with a clear deliverable.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return <ProcessContent />;
}
