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
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
          <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
              console.log(params);
              setDialogParams(params);
            }}
          />,
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

    return (
      <Dialog
        sx={{ m: 0, p: 2 }}
        // TransitionProps={{ onEntered: handleEntered }}
        open={!!dialogParams}
      >
        <DialogTitle>确认提示</DialogTitle>
        <DialogContent dividers>
          {`确定要删除？${dialogParams.row.name}`}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo}>不</Button>
          <LoadingConfirmBtn
            action={async () => action({
              path: "/adventure/delete",
              params: {
                id: dialogParams.id,
              },
            })}
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
