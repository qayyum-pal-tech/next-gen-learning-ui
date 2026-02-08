"use client";

import RoadmapPage from "@/app/components/RoadmapPage";
import { useParams } from "next/navigation";

const Home = () => {
  const params = useParams();
  const id = params?.id as string;

  return <RoadmapPage roadmapId={id} userId={"001"} />;
};

export default Home;
