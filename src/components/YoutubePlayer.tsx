import { Typography } from "@mui/material";
import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";

export function YoutubePLayer({ videoId, ...props }: YouTubeProps) {
  return videoId ? (
    <YouTube videoId={videoId} {...props} />
  ) : (
    <Typography variant="body2" component="p">
      Nenhum vídeo adicionado
    </Typography>
  );
}
