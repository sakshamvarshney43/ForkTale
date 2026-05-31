import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  GitFork,
  GitBranch,
  Star,
  User,
  Clock,
  Globe,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  storyService,
  publishService,
  ratingService,
  forkService,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Publishing } from "../types";

//Helper
const timeAgo = (date:string)=>{
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff/86400000);

    if(days > 30) return new Date(date).toLocaleDateString();
    if(days > 0) return `${days}d ago`;
    const hours = Math.floor(diff/3600000);
    if(hours > 0)return `${hours}h ago`;
    return 'just now';
}

//Star Rating
function StarRating({
    publishingId,
    avgRating,
    totalRating,
    userRating,
};{
    publishingId;
    avgRating:number;
    totalRatings:number;
    userRating:number | null;
}){
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();
    const [hovered,setHovered] = useState(0);

    const rateMutation = useMutation({
        mutationFn:(stars:number) => ratingService.rate(publishingId,stars);
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['ending,publishingId']});
        },
    });

    const deleteMutation = useMutation({
        mutationFn:() => ratingService.deleteRating(publishingId),
        onSuccess:()=>{
            queryClient.invalidateQueries({ queryKey:['ending',publishingId]});
        },
    });

     return (
    <div className="flex items-center gap-3">
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            disabled={!isAuthenticated}
            onClick={() => {
              if (userRating === star) {
                deleteMutation.mutate();
              } else {
                rateMutation.mutate(star);
              }
            }}
            onMouseEnter={() => isAuthenticated && setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform duration-100"
            style={{
              transform:
                hovered >= star ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            <Star
              size={16}
              style={{
                color:
                  hovered >= star || (userRating ?? 0) >= star
                    ? '#f0b429'
                    : '#383b3f',
                fill:
                  hovered >= star || (userRating ?? 0) >= star
                    ? '#f0b429'
                    : 'transparent',
                transition: 'all 0.1s',
              }}
            />
          </button>
        ))}
      </div>
      {/* Stats */}
      <span style={{ color: '#62666d', fontSize: '12px' }}>
        {avgRating > 0 ? avgRating.toFixed(1) : '—'}
        {totalRatings > 0 && (
          <span className="ml-1">({totalRatings})</span>
        )}
      </span>

      {userRating && (
        <span
          className="text-xs px-1.5 py-0.5 rounded"
          style={{
            background: 'rgba(240, 180, 41, 0.08)',
            border: '1px solid rgba(240, 180, 41, 0.15)',
            color: '#f0b429',
          }}
        >
          Your rating: {userRating}★
        </span>
      )}
    </div>
  );
}

//Ending Card
function EndingCard({
  ending,
  isActive,
  onClick,
}: {
  ending: Publishing;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2.5 rounded transition-colors duration-150"
      style={{
        background: isActive ? '#161718' : 'transparent',
        border: isActive
          ? '1px solid rgba(141, 214, 255, 0.2)'
          : '1px solid #23252a',
        color: isActive ? '#8dd6ff' : '#8a8f98',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = '#161718';
          (e.currentTarget as HTMLElement).style.color = '#f7f8f8';
          (e.currentTarget as HTMLElement).style.borderColor = '#383b3f';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
          (e.currentTarget as HTMLElement).style.color = '#8a8f98';
          (e.currentTarget as HTMLElement).style.borderColor = '#23252a';
        }
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium">
          {ending.branch.name}
        </span>
        {ending.avgRating && ending.avgRating > 0 ? (
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: '#f0b429' }}
          >
            <Star size={10} fill="#f0b429" />
            {ending.avgRating.toFixed(1)}
          </span>
        ) : null}
      </div>
      <p className="text-xs" style={{ color: '#62666d' }}>
        {timeAgo(ending.publishedAt)}
        {ending.totalRatings
          ? ` · ${ending.totalRatings} ratings`
          : ''}
      </p>
    </button>
  );
}

