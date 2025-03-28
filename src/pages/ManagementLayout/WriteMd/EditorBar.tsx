import React, { useRef, useState } from "react";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import TitleIcon from "@mui/icons-material/Title";
import CodeIcon from "@mui/icons-material/Code";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ReplyIcon from "@mui/icons-material/Reply";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Theme, useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useConfirm } from "material-ui-confirm";
import action from "../../../request/action";

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const IconToolTip = (props) => {
  return <a className={props.className}>{props.children}</a>;
};

const IconToolTipWarp = styled(IconToolTip)<any>(({ marginLeft }) => {
  return {
    "&:hover": {
      color: "#f2f2f2",
      backgroundColor: "#595959",
    },
    color: "#595959",
    padding: "11px",
    display: "flex",
    fontSize: "16px",
    alignItems: "center",
    "& span": {
      fontSize: "13px",
      marginLeft: marginLeft || "8px",
      lineHeight: "17px",
    },
  };
});

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

const FormDialog = React.forwardRef<any, any>((props, ref) => {
  const [open, setOpen] = React.useState(false);
  const [selectData, setSelectData] = React.useState([]);
  const tags = useSelector((state: any) => state.tagsReducer.tags);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    setOpen(false);
  };

  React.useImperativeHandle(ref, () => ({
    openDialog,
    closeDialog,
  }));

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectData(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleConfirm = () => {
    props?.onConfirm(selectData);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        disableEscapeKeyDown
        open={open}
        fullWidth
        onClose={handleClose}
      >
        <DialogTitle>选择标签</DialogTitle>
        <DialogContent>
          <Select
            value={selectData}
            multiple
            style={{
              width: "100%",
            }}
            onChange={handleChange}
          >
            {Object.keys(tags).map((key) => (
              <MenuItem key={tags[key].en} value={tags[key].id}>
                {tags[key].ch}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>关闭</Button>
          <Button onClick={handleConfirm}>确定</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default (props) => {
  const tagModalRef = React.useRef(null) as any;
  const [articleTags, setArticleTags] = useState([]);
  const tags = useSelector((state: any) => state.tagsReducer.tags);

  const inputRef = useRef<any>(null);

  const editorRef = props.textRef
  const setMdContent = props.setMdContent

  const confirm = useConfirm();

  const UlStyle = {
    margin: 0,
    listStyleType: "none",
    backgroundColor: "#d9d9d9",
    borderBottom: "1px solid #ccc",
    fontSize: 0,
    display: "flex",
    flexFlow: "row wrap",
    lineHeight: 1,
  };

  const liStyle = {
    display: "inline-block",
    cursor: "pointer",
    textAlign: "center" as any,
  };

  const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  return (
    <>
      <ul style={UlStyle}>
        <BootstrapTooltip title="上传图片" onClick={() => {
          if(inputRef.current){
            inputRef.current?.click()
          }
        }}>
          <li style={liStyle}>
            <IconToolTipWarp >
              <PhotoSizeSelectActualIcon sx={{ fontSize: 17 }} />
              <VisuallyHiddenInput type="file" />
            </IconToolTipWarp>

            <VisuallyHiddenInput onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files || [];
              const res = await action({
                path:'/picture/upload',
                params:{
                  file:files[0]
                }
              })
              const newStr = editorRef.current.value.concat(
                `![${res.data}](/api/picture/getPic?picName=${res.data})`
              )
              editorRef.current.value = newStr
              setMdContent(newStr)
            }} ref={inputRef} type="file"/>
          </li>
        </BootstrapTooltip>
        <BootstrapTooltip title="标题" onClick={() => {
          const newStr = editorRef.current.value.concat(
            `#`
          )
          editorRef.current.value = newStr
          setMdContent(newStr)
        }}>
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
        <BootstrapTooltip title="选择标签">
          <li
            style={liStyle}
            onClick={() => {
              tagModalRef.current.openDialog();
            }}
          >
            <IconToolTipWarp>
              <LocalOfferIcon sx={{ fontSize: 17 }} />
              <span>选择标签</span>
            </IconToolTipWarp>
          </li>
        </BootstrapTooltip>
        <BootstrapTooltip title="发布">
          <li
            onClick={() => {
              // 提交
              confirm({
                title: "发布",
                description: (
                  <>
                    标签列表：
                    {articleTags.map((articleTag: any) => {
                      return <span key={articleTag.en}>{articleTag.ch}，</span>;
                    })}
                  </>
                ),
                confirmationText: "确定",
                cancellationText: "取消",
              }).then(() => props.onConfirm(articleTags));
            }}
            style={{
              ...liStyle,
              marginLeft: "auto",
            }}
          >
            <IconToolTipWarp>
              <ReplyIcon sx={{ fontSize: 17 }} />
              <span>发布</span>
            </IconToolTipWarp>
          </li>
        </BootstrapTooltip>
      </ul>
      <FormDialog
        ref={tagModalRef}
        onConfirm={(selectData) => {
          setArticleTags(selectData.map((item) => tags[item]));
          tagModalRef.current.closeDialog();
        }}
      />
    </>
  );
};
