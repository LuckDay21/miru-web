import React from "react";
import AnimeCard from "./anime-card";
import { MediaList } from "@/types/miruro-api";
import { ROUTES } from "@/constants/routes";
import { Sparkles } from "lucide-react";

type Props = {
  title: string;
  anime: MediaList[];
};

const FeaturedCollectionCard = (props: Props) => {
  if (!props.anime || props.anime.length < 3) return null;

  return (
    <div className="h-[20rem] flex flex-col justify-between items-center rounded-2xl overflow-hidden bg-[#0d121d] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 w-full relative p-5 group shadow-lg">
      <div className="flex items-center gap-2 z-20">
        <Sparkles className="h-4 w-4 text-indigo-400" />
        <h3 className="text-base font-bold text-white tracking-wide">
          {props.title}
        </h3>
      </div>

      <div className="w-full relative grow flex items-end justify-center pb-2">
        {props.anime.slice(0, 3).map((item, index) => {
          const title =
            item.title?.english || item.title?.romaji || item.title?.native || "Untitled";
          const poster =
            item.coverImage?.extraLarge || item.coverImage?.large || "";

          const cardPositions = [
            "absolute -bottom-8 left-[10%] -rotate-12 w-32 shadow-2xl transition-transform group-hover:-translate-y-2 group-hover:-rotate-14",
            "absolute -bottom-6 left-[32%] -rotate-3 w-32 shadow-2xl z-10 transition-transform group-hover:-translate-y-4",
            "absolute -bottom-8 right-[10%] rotate-12 w-32 shadow-2xl transition-transform group-hover:-translate-y-2 group-hover:rotate-14",
          ];

          return (
            <div key={item.id || index} className={cardPositions[index]}>
              <AnimeCard
                title={title}
                format={item.format}
                score={item.averageScore}
                poster={poster}
                href={`${ROUTES.ANIME_DETAILS}/${item.id}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedCollectionCard;
