import React, { useEffect } from "react";
import {
  GridActionsCellItem,
  DataGrid,
  GridRowsProp,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import action from "../../../request/action";
import { useSelector } from "react-redux";
import ArticleTags from "../../../components/ArticleTags";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import LoadingConfirmBtn from "../../../components/LoadingConfirmBtn";
import { Slide, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TransitionProps } from "@mui/material/transitions";
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';

const MdList = () => {
  const tags = useSelector((state: any) => state.tagsReducer.tags);
  const [dialogParams, setDialogParams] = React.useState<any>(null);

  const navigate = useNavigate();

  const mdColumn = React.useMemo(() => {
    return [
      { field: "id", headerName: "日志id", width: 100 },
      { field: "name", headerName: "日志名", width: 100 },
      { field: "isPublish", headerName: "是否发布", width: 100 },
      {
        field: "tag",
        headerName: "标签",
        renderCell: (params: GridRenderCellParams<any>) => {
          return <ArticleTags tags={tags} artTags={params.value} />;
        },
        width: 400,
      },
      {
        field: "actions",
        type: "actions",
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => {
            console.log("params", params);
            navigate("/management/writeMd", {
              state: {
                id: params.row.id,
                name: params.row.name,
                tag: params.row.tag,
                content: params.row.content,
              },
            });
          }} />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
              setDialogParams({
                ...params,
                dialogTip: "确定要删除？",
                action:async () => action({
                  path: "/adventure/delete",
                  params: {
                    id: params.id,
                  },
                })
              });
            }}
          />,
          <GridActionsCellItem
            icon={<VerticalAlignBottomIcon />}
            label="Publish"
            onClick={() => {
              setDialogParams({
                ...params,
                dialogTip: `确定要${params.row.isPublish ? '下架':'发布'}？`,
                action:async () => action({
                  path: `/adventure/${  params.row.isPublish ? 'unpublish' : 'publish'}`,
                  params: {
                    id: params.id,
                  },
                })
              });
              
            }}
          />
        ],
      },
    ];
  }, []) as any;

  const [rows, setRows] = React.useState<GridRowsProp>([]);

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  function loadServerRows(page: number, data: any): Promise<any> {
    return action({
      path: "/adventure/adminList",
      params: {
        page: page + 1,
        size: paginationModel.pageSize,
      },
    }) as any;
  }

  const [loading, setLoading] = React.useState(false);

  const refresh = async (active) => {
    setLoading(true);
    const newRows = (await loadServerRows(
      paginationModel.page,
      mdColumn
    )) as any;

    if (!active) {
      return;
    }

    setRows(newRows.data);
    setLoading(false);
  }

  React.useEffect(() => {
    let active = true;

    refresh(active);

    return () => {
      active = false;
    };
  }, [paginationModel.page, mdColumn]);

  const renderConfirmDialog = () => {
    if (!dialogParams) {
      return null;
    }

    // const { newRow, oldRow } = promiseArguments;
    // const mutation = computeMutation(newRow, oldRow);

    const handleNo = () => {
      setDialogParams(null);
    };

    // const Transition = React.forwardRef(function Transition(
    //   props: TransitionProps & {
    //     children: React.ReactElement<any, any>;
    //   },
    //   ref: React.Ref<unknown>,
    // ) {
    //   return <Slide direction="up" ref={ref} {...props} />;
    // });


    return (
      <Dialog
        sx={{ m: 0, p: 2 }}
        // TransitionComponent={Transition}
        open={!!dialogParams}
        keepMounted
        onClose={handleNo}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>确认提示</DialogTitle>
        <DialogContent dividers>
          {`${dialogParams.dialogTip}${dialogParams.row.name}`}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo}>不</Button>
          <LoadingConfirmBtn
            action={dialogParams.action}
            text="是"
            callback={async (result) => {
              console.log("result", result);
							await refresh(true)
							setDialogParams(null)
            }}
          />
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      {renderConfirmDialog()}
      <Stack
        style={{ paddingLeft: 20 }}
        direction="row"
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Button
          size="small"
          onClick={() => {
            navigate("/management/writeMd");
          }}
        >
          新建日志
        </Button>
      </Stack>
      <DataGrid
        rows={rows}
        columns={mdColumn}
        pagination
        checkboxSelection
        paginationModel={paginationModel}
        pageSizeOptions={[5]}
        rowCount={100}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        // onRowSelectionModelChange={(newRowSelectionModel) => {
        //   setRowSelectionModel(newRowSelectionModel);
        // }}
        // rowSelectionModel={rowSelectionModel}
        loading={loading}
        keepNonExistentRowsSelected
      />
    </>
  );
};

export default MdList;
