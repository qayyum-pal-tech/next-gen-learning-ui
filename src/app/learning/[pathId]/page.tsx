"use client";

import React from "react";
import PathDetailedView from "@/components/learning/PathDetailedView";
import { useParams } from "next/navigation";

export default function PathDetailsPage() {
  const params = useParams();
  const pathId = params.pathId as string;

  return (
    <div className="min-h-screen bg-slate-950">
      <PathDetailedView />
    </div>
  );
}
