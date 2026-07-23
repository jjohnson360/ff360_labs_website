"use client";

import dynamic from "next/dynamic";

const PhysicsFooter = dynamic(() => import("@/components/PhysicsFooter"), {
  ssr: false,
});

export default function Footer() {
  return (
    <footer className="mt-auto w-full">
      <PhysicsFooter />
    </footer>
  );
}
