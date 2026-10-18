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
  if (!props.anime || props.anime.length === 0) return null;

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Category Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
        <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
          {props.title}
        </h3>
      </div>

      {/* 3 Anime Cards Displayed Directly */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full">
        {props.anime.slice(0, 3).map((item, index) => {
          const title =
            item.title?.english ||
            item.title?.romaji ||
            item.title?.native ||
            "Untitled";
          const subTitle = item.title?.english ? item.title?.romaji : undefined;
          const poster =
            item.coverImage?.extraLarge || item.coverImage?.large || "";

          return (
            <div key={item.id || index} className="w-full">
              <AnimeCard
                title={title}
                subTitle={subTitle}
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
