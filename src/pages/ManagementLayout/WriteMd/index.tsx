import { Input, Typography } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import TitleIcon from '@mui/icons-material/Title';
import CodeIcon from '@mui/icons-material/Code';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ReplyIcon from '@mui/icons-material/Reply';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const EditorHead = React.forwardRef((props:any,ref:any) => {
  const InputStyle = {
    flexShrink: 0,
    width: "100%",
    padding: "0 80px 10px 40px",
    marginBottom: 0,
    border: "none",
    fontSize: "30px",
    fontWeight: 400,
    lineHeight: "30px",
    boxShadow: "none",
    color: "#595959",
    backgroundColor: "transparent",
    outline: "none",
    borderRadius: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as any,
  };
  return <input onChange={props.onChange} ref={ref} style={InputStyle} />;
});

const IconToolTip = (props) => {
	return <a className={props.className}>{props.children}</a>
}

const IconToolTipWarp = styled(IconToolTip)<any>(() => {
  return {
		"&:hover": {
			color:'#f2f2f2',
			backgroundColor:'#595959'
		},
    color: "#595959",
    padding: "11px",
    display: "flex",
    lineHeight: "0px",
    fontSize: "16px",
		alignItems:"center",
		"& span":{
			fontSize:"13px",
			marginLeft:"8px",
		}
  };
});

const EditorBar = () => {
  const UlStyle = {
    margin: 0,
    listStyleType: "none",
    backgroundColor: "#d9d9d9",
    borderBottom: "1px solid #ccc",
    fontSize: 0,
  };
  const liStyle = {
    display: "inline-block",
    cursor: "pointer",
    textAlign: "center" as any,
  };

  return (
    <ul style={UlStyle}>
      <BootstrapTooltip title="上传图片">
        <li style={liStyle}>
          <IconToolTipWarp>
            <PhotoSizeSelectActualIcon sx={{ fontSize: 17 }} />
          </IconToolTipWarp>
        </li>
      </BootstrapTooltip>
      <BootstrapTooltip title="标题">
        <li style={liStyle}>
          <IconToolTipWarp>
            <TitleIcon sx={{ fontSize: 17 }} />
          </IconToolTipWarp>
        </li>
      </BootstrapTooltip>
      <BootstrapTooltip title="代码块">
        <li style={liStyle}>
          <IconToolTipWarp>
            <CodeIcon sx={{ fontSize: 17 }} />
          </IconToolTipWarp>
        </li>
      </BootstrapTooltip>
      <BootstrapTooltip title="标记">
        <li style={liStyle}>
          <IconToolTipWarp>
            <BookmarkIcon sx={{ fontSize: 17 }} />
          </IconToolTipWarp>
        </li>
      </BootstrapTooltip>
			<BootstrapTooltip title="发布">
        <li style={{
					...liStyle,
					float:'right'
				}}>
          <IconToolTipWarp>
            <ReplyIcon sx={{ fontSize: 17 }} />
						<span>发布</span>
          </IconToolTipWarp>
        </li>
      </BootstrapTooltip>
    </ul>
  );
};

export default () => {
	const titleRef = React.useRef(null) as any;
	const [previewHead,setPreviewHead] = React.useState('');

  return (
    <Grid container>
      <Grid item xs={6}>
        <EditorHead ref={titleRef} onChange={() => {
					setPreviewHead(titleRef.current?.value || '')
				}}/>
        <EditorBar />
        <textarea
          style={{
            width: "100%",
            flex: 1,
            padding: "40px 40px 80px",
            marginBottom: 0,
            resize: "none",
            color: "#333",
            backgroundColor: "transparent",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "30px",
            border: "none",
            outline: "none",
            overflow: "auto",
          }}
        ></textarea>
      </Grid>
      <Grid item xs={6}>
				<div style={{
			    position: 'relative',
					height: '100%',
					overflowY: "auto",
					color: '#333',
					backgroundColor: '#fcfaf2',
					padding: "40px 40px 80px",
					fontSize: "16px",
					lineHeight: 1.75
				}}>
					<h1 style={{
						marginBottom: '20px',
				    fontSize: '26px',
				    color: "inherit",
					}}>{previewHead}</h1>
				</div>
			</Grid>
    </Grid>
  );
};
