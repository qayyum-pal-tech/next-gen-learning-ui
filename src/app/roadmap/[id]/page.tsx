"use client";

import RoadmapPage from "@/app/components/RoadmapPage";
import { useAuthStore } from "@/store/auth.store";
import { useParams } from "next/navigation";

const Home = () => {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuthStore();
  const USER_ID = user?._id || user?.id;

  return <RoadmapPage roadmapId={id} userId={USER_ID} />;
};

export default Home;
