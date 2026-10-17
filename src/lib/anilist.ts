import {
  MediaList,
  PaginatedResponse,
} from "@/types/miruro-api";
import { IAnimeDetails } from "@/types/anime-details";
import { IAnimeSearch, ISuggestionAnime, SearchAnimeParams } from "@/types/anime";

const ANILIST_GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

const MEDIA_FIELDS = `
  id
  idMal
  title {
    romaji
    english
    native
  }
  coverImage {
    large
    extraLarge
    color
  }
  bannerImage
  format
  season
  seasonYear
  episodes
  duration
  status
  averageScore
  meanScore
  popularity
  favourites
  genres
  countryOfOrigin
  isAdult
  description
  nextAiringEpisode {
    episode
    airingAt
    timeUntilAiring
  }
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  studios {
    nodes {
      name
      isAnimationStudio
    }
  }
`;

export async function fetchAniListGraphQL<T = any>(
  query: string,
  variables: Record<string, any> = {},
): Promise<T> {
  const res = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`AniList GraphQL error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0]?.message || "AniList GraphQL query error");
  }

  return json.data;
}

export async function getAniListPopular(
  page: number = 1,
  perPage: number = 20,
): Promise<PaginatedResponse<MediaList>> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL(query, { page, perPage });
  const pageInfo = data.Page.pageInfo;
  const results = data.Page.media || [];

  return {
    page: pageInfo.currentPage,
    perPage: pageInfo.perPage,
    total: pageInfo.total,
    hasNextPage: pageInfo.hasNextPage,
    results: results.filter((item: MediaList) => !item.isAdult),
  };
}

export async function getAniListTrending(
  page: number = 1,
  perPage: number = 14,
): Promise<PaginatedResponse<MediaList>> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL(query, { page, perPage });
  const pageInfo = data.Page.pageInfo;
  const results = data.Page.media || [];

  return {
    page: pageInfo.currentPage,
    perPage: pageInfo.perPage,
    total: pageInfo.total,
    hasNextPage: pageInfo.hasNextPage,
    results: results.filter((item: MediaList) => !item.isAdult),
  };
}

export async function getAniListUpcoming(
  page: number = 1,
  perPage: number = 14,
): Promise<PaginatedResponse<MediaList>> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL(query, { page, perPage });
  const pageInfo = data.Page.pageInfo;
  const results = data.Page.media || [];

  return {
    page: pageInfo.currentPage,
    perPage: pageInfo.perPage,
    total: pageInfo.total,
    hasNextPage: pageInfo.hasNextPage,
    results: results.filter((item: MediaList) => !item.isAdult),
  };
}

export async function getAniListRecent(
  page: number = 1,
  perPage: number = 20,
): Promise<PaginatedResponse<MediaList>> {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(type: ANIME, sort: UPDATED_AT_DESC, status: RELEASING, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL(query, { page, perPage });
  const pageInfo = data.Page.pageInfo;
  const results = data.Page.media || [];

  return {
    page: pageInfo.currentPage,
    perPage: pageInfo.perPage,
    total: pageInfo.total,
    hasNextPage: pageInfo.hasNextPage,
    results: results.filter((item: MediaList) => !item.isAdult),
  };
}

export async function getAniListSpotlight(): Promise<MediaList[]> {
  const query = `
    query {
      Page(page: 1, perPage: 8) {
        media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL(query);
  const results = (data.Page?.media || []) as MediaList[];
  return results.filter((item) => !item.isAdult && item.bannerImage);
}

export async function getAniListAnimeDetails(animeId: string): Promise<IAnimeDetails> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        ${MEDIA_FIELDS}
        trailer {
          id
          site
          thumbnail
        }
        synonyms
        characters(sort: ROLE, perPage: 12) {
          edges {
            role
            node {
              id
              name {
                full
                native
                userPreferred
              }
              image {
                large
                medium
              }
            }
            voiceActors(language: JAPANESE, sort: RELEVANCE) {
              id
              name {
                full
                native
              }
              image {
                large
              }
              languageV2
            }
          }
        }
        relations {
          edges {
            relationType
            node {
              id
              title {
                english
                romaji
                native
              }
              coverImage {
                large
                extraLarge
              }
              format
              episodes
            }
          }
        }
        recommendations(perPage: 10, sort: RATING_DESC) {
          nodes {
            mediaRecommendation {
              id
              title {
                english
                romaji
                native
              }
              coverImage {
                large
                extraLarge
              }
              format
              episodes
            }
          }
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL(query, { id: parseInt(animeId, 10) });
  const media = data.Media;

  const title =
    media.title?.english || media.title?.romaji || media.title?.native || "Untitled";
  const poster = media.coverImage?.extraLarge || media.coverImage?.large || "";

  const charactersVoiceActors = (media.characters?.edges || [])
    .filter((edge: any) => edge && edge.node && edge.node.id)
    .map((edge: any) => ({
      character: {
        id: String(edge.node.id),
        poster: edge.node.image?.large || "",
        name: edge.node.name?.full || "Unknown",
        cast: edge.role,
      },
      voiceActor: {
        id: String(edge.voiceActors?.[0]?.id || ""),
        poster: edge.voiceActors?.[0]?.image?.large || "",
        name: edge.voiceActors?.[0]?.name?.full || "Unknown",
        cast: edge.voiceActors?.[0]?.languageV2 || "Japanese",
      },
    }));

  const seasons = (media.relations?.edges || [])
    .filter((edge: any) => edge && edge.node && edge.node.id)
    .map((edge: any) => ({
      id: String(edge.node.id),
      name: edge.node.title?.english || edge.node.title?.romaji || "Related Anime",
      title: edge.relationType || "Relation",
      poster: edge.node.coverImage?.large || edge.node.coverImage?.extraLarge || "",
      isCurrent: edge.node.id === media.id,
    }));

  const recommendedAnimes = (media.recommendations?.nodes || [])
    .filter((rec: any) => rec && rec.mediaRecommendation && rec.mediaRecommendation.id)
    .map((rec: any) => {
      const rMedia = rec.mediaRecommendation;
      return {
        id: String(rMedia.id),
        name: rMedia.title?.english || rMedia.title?.romaji || "Untitled",
        jname: rMedia.title?.native || rMedia.title?.romaji || "",
        poster: rMedia.coverImage?.extraLarge || rMedia.coverImage?.large || "",
        duration: `${rMedia.episodes || 0} eps`,
        type: rMedia.format || "TV",
        episodes: {
          sub: rMedia.episodes || 0,
          dub: rMedia.episodes || 0,
        },
      };
    });

  const airedString = media.startDate?.year
    ? `${media.startDate.year}-${media.startDate.month || 1}-${media.startDate.day || 1}`
    : "N/A";

  const studiosString =
    media.studios?.nodes?.map((s: any) => s.name).join(", ") || "N/A";

  const relatedAnimes = (media.relations?.edges || [])
    .filter((edge: any) => edge && edge.node && edge.node.id)
    .map((edge: any) => {
      const rNode = edge.node;
      return {
        id: String(rNode.id),
        name: rNode.title?.english || rNode.title?.romaji || "Untitled",
        jname: rNode.title?.native || rNode.title?.romaji || "",
        poster: rNode.coverImage?.extraLarge || rNode.coverImage?.large || "",
        duration: `${rNode.episodes || 0} eps`,
        type: rNode.format || edge.relationType || "TV",
        episodes: {
          sub: rNode.episodes || 0,
          dub: rNode.episodes || 0,
        },
      };
    });

  return {
    anime: {
      info: {
        id: String(media.id),
        anilistId: media.id,
        malId: media.idMal || 0,
        name: title,
        poster: poster,
        bannerImage: media.bannerImage || media.coverImage?.extraLarge || "",
        description: media.description || "",
        stats: {
          rating: media.averageScore ? `${media.averageScore}%` : "N/A",
          quality: "HD",
          episodes: {
            sub: media.episodes || 0,
            dub: media.episodes || 0,
          },
          type: media.format || "TV",
          duration: media.duration ? `${media.duration} min` : "N/A",
        },
        promotionalVideos: media.trailer?.id
          ? [
              {
                title: "Trailer",
                source:
                  media.trailer.site === "youtube"
                    ? `https://www.youtube.com/watch?v=${media.trailer.id}`
                    : media.trailer.id,
                thumbnail: media.trailer.thumbnail || "",
              },
            ]
          : [],
        charactersVoiceActors,
      },
      moreInfo: {
        japanese: media.title?.native || "",
        synonyms: media.synonyms?.join(", ") || "",
        aired: airedString,
        premiered:
          media.season && media.seasonYear
            ? `${media.season} ${media.seasonYear}`
            : "N/A",
        duration: media.duration ? `${media.duration} min` : "N/A",
        status: media.status || "N/A",
        malscore: media.meanScore ? String(media.meanScore) : "N/A",
        genres: media.genres || [],
        studios: studiosString,
        producers: [],
      },
    },
    seasons,
    mostPopularAnimes: [],
    relatedAnimes,
    recommendedAnimes,
  };
}

export async function getAniListAnimeSchedule(
  targetDateInput?: Date | string | number,
): Promise<{
  scheduledAnimes: Array<{
    id: string;
    name: string;
    jname: string;
    poster: string;
    time: string;
    airingTimestamp: number;
    secondsUntilAiring: number;
    episode: number;
  }>;
}> {
  let target: Date;
  if (targetDateInput instanceof Date) {
    target = new Date(targetDateInput);
  } else if (typeof targetDateInput === "number") {
    target = new Date(targetDateInput);
  } else if (typeof targetDateInput === "string" && targetDateInput.trim()) {
    const parts = targetDateInput.split("-").map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      target = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
    } else {
      target = new Date(targetDateInput);
    }
    if (isNaN(target.getTime())) {
      target = new Date();
    }
  } else {
    target = new Date();
  }

  // Beginning of target day (00:00:00 local time)
  const startOfDay = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
    0,
    0,
    0,
    0,
  );
  const startSeconds = Math.floor(startOfDay.getTime() / 1000);
  const endSeconds = startSeconds + 86400; // 24 hours later

  const query = `
    query ($airingAt_greater: Int, $airingAt_lesser: Int) {
      Page(page: 1, perPage: 50) {
        airingSchedules(
          airingAt_greater: $airingAt_greater,
          airingAt_lesser: $airingAt_lesser,
          sort: TIME
        ) {
          id
          airingAt
          episode
          timeUntilAiring
          media {
            ${MEDIA_FIELDS}
          }
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL(query, {
    airingAt_greater: startSeconds,
    airingAt_lesser: endSeconds,
  });

  const schedules = data.Page?.airingSchedules || [];
  const nowMs = Date.now();

  const scheduledAnimes = schedules.map((item: any) => {
    const airingTimeMs = item.airingAt ? item.airingAt * 1000 : nowMs;
    const diffSec = Math.floor((airingTimeMs - nowMs) / 1000);

    let timeString: string;
    if (diffSec > 0) {
      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      timeString = hours > 0 ? `in ${hours}h ${minutes}m` : `in ${minutes}m`;
    } else {
      timeString = "Aired";
    }

    const m = item.media;
    return {
      id: String(m?.id || item.id),
      name: m?.title?.english || m?.title?.romaji || m?.title?.native || "Untitled",
      jname: m?.title?.native || m?.title?.romaji || "",
      poster: m?.coverImage?.extraLarge || m?.coverImage?.large || "",
      time: timeString,
      airingTimestamp: airingTimeMs,
      secondsUntilAiring: diffSec,
      episode: item.episode || 1,
    };
  });

  return { scheduledAnimes };
}

export async function getAniListAnimeRelations(
  anilistId: string,
): Promise<MediaList[]> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        relations {
          edges {
            node {
              ${MEDIA_FIELDS}
            }
          }
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL(query, { id: parseInt(anilistId, 10) });
  const edges = data.Media?.relations?.edges || [];
  return edges
    .map((e: any) => e.node as MediaList)
    .filter((item: MediaList) => item && !item.isAdult);
}

export async function getAniListSearchResults(
  params: SearchAnimeParams,
): Promise<IAnimeSearch> {
  const query = `
    query ($search: String, $page: Int, $perPage: Int, $genre: String, $format: MediaFormat, $status: MediaStatus, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        media(search: $search, type: ANIME, genre: $genre, format: $format, status: $status, sort: $sort, isAdult: false) {
          ${MEDIA_FIELDS}
        }
      }
    }
  `;

  const variables: Record<string, any> = {
    page: params.page || 1,
    perPage: 20,
    search: params.q ? params.q.replace(/^"+|"+$/g, "").trim() || undefined : undefined,
    genre: params.genres || undefined,
    format: params.type ? (params.type.toUpperCase() as any) : undefined,
    status: params.status ? (params.status.toUpperCase() as any) : undefined,
    sort: params.sort ? [params.sort.toUpperCase() as any] : ["POPULARITY_DESC"],
  };

  const data = await fetchAniListGraphQL(query, variables);
  const pageInfo = data.Page?.pageInfo;
  const results = (data.Page?.media || []) as MediaList[];
  const filtered = results.filter((m) => !m.isAdult);

  const calculatedPages = Math.ceil((pageInfo?.total || 0) / 20);
  const totalPages = Math.min(calculatedPages || 1, 20);

  return {
    animes: filtered.map((m) => ({
      id: String(m.id),
      name: m.title?.english || m.title?.romaji || m.title?.native || "Untitled",
      jname: m.title?.native || m.title?.romaji || "",
      poster: m.coverImage?.extraLarge || m.coverImage?.large || "",
      episodes: {
        sub: m.episodes || 0,
        dub: m.episodes || 0,
      },
      type: m.format as any,
    })),
    totalPages: totalPages > 0 ? totalPages : 1,
    hasNextPage: pageInfo?.hasNextPage ?? false,
    currentPage: pageInfo?.currentPage ?? 1,
  };
}

export async function getAniListSearchSuggestions(
  q: string,
): Promise<ISuggestionAnime[]> {
  if (!q.trim()) return [];

  const query = `
    query ($search: String) {
      Page(page: 1, perPage: 8) {
        media(search: $search, type: ANIME, isAdult: false) {
          id
          title {
            english
            romaji
            native
          }
          coverImage {
            large
            extraLarge
          }
          format
          episodes
          status
          startDate {
            year
          }
        }
      }
    }
  `;

  const data = await fetchAniListGraphQL(query, { search: q.trim() });
  const items = data.Page?.media || [];

  return items.map((item: any) => ({
    id: String(item.id),
    name: item.title?.english || item.title?.romaji || item.title?.native || "Untitled",
    jname: item.title?.romaji || "",
    poster: item.coverImage?.extraLarge || item.coverImage?.large || "",
    episodes: {
      sub: item.episodes || 0,
      dub: item.episodes || 0,
    },
    type: item.format as any,
    moreInfo: [
      item.startDate?.year ? String(item.startDate.year) : "",
      item.format || "",
      item.status || "",
    ].filter(Boolean),
  }));
}
