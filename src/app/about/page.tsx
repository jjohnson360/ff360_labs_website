import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "ff360_labs is a creative technology studio based in Conway, Arkansas — working across web, interactive, 3D, and creative software.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return <AboutContent />;
}
