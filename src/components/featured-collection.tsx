import React from "react";
import Container from "./container";
import FeaturedCollectionCard from "./featured-collection-card";
import { MediaList } from "@/types/miruro-api";

type CategoryItem = {
  title: string;
  anime: MediaList[];
};

type Props = {
  featuredAnime: CategoryItem[];
  loading: boolean;
};

const FeaturedCollection = ({ featuredAnime, loading }: Props) => {
  if (loading || !featuredAnime?.length) return <LoadingSkeleton />;

  return (
    <Container className="py-8 md:py-12 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500 shrink-0" />
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Featured Collections
        </h2>
      </div>

      <div className="grid w-full gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {featuredAnime.map((category, idx) => (
          <FeaturedCollectionCard
            title={category.title}
            key={idx}
            anime={category.anime}
          />
        ))}
      </div>
    </Container>
  );
};

const LoadingSkeleton = () => {
  return (
    <Container className="py-8 md:py-12 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-slate-800 shrink-0" />
        <div className="h-7 w-48 rounded-lg bg-slate-800/80 animate-pulse" />
      </div>
      <div className="grid w-full gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="rounded-2xl h-[20rem] w-full bg-slate-900/60 border border-white/5 animate-pulse"
          />
        ))}
      </div>
    </Container>
  );
};

export default FeaturedCollection;
