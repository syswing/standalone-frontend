import React from 'react';
import {
  Chip,
  Stack,
} from "@mui/material";
import SellIcon from "@mui/icons-material/Sell";
// tags 所有标签 artTags 日志的标签
const ArticleTags = ({ tags, artTags }) => {
  const artTagList = artTags?.split(",") || [];

  const ArticleTag = ({ label }) => {
    return <Chip icon={<SellIcon fontSize="small" />} label={label} />;
  };

  return (
    <Stack
      spacing={{ xs: 1, sm: 2 }}
      direction="row"
      useFlexGap
      flexWrap="wrap"
    >
      {artTagList.map((item, index) => {
        return <ArticleTag key={index} label={tags[item]?.ch} />;
      })}
    </Stack>
  );
};

export default ArticleTags
