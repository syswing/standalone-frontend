import React from "react";
import {
  GridActionsCellItem,
  DataGrid,
  GridRowsProp,
} from "@mui/x-data-grid";
import action from "../../../request/action";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import LoadingConfirmBtn from "../../../components/LoadingConfirmBtn";
import { Stack, TextField, styled } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { VisuallyHiddenInput } from "../../../components/StyledComponent";
import LoadingButton from "@mui/lab/LoadingButton";

const TagList = () => {
  const [dialogParams, setDialogParams] = React.useState<any>(null);

  const [addTagModal, setAddTagModal] = React.useState<string|boolean>(false);
  const [modalLoading, setModalLoading] = React.useState<boolean>(false);

  const tagColumn = React.useMemo(() => {
    return [
      { field: "id", headerName: "标签id", width: 100 },
      { field: "ch", headerName: "中文名", width: 100 },
      { field: "en", headerName: "英文名", width: 100 },
      {
        field: "actions",
        type: "actions",
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => {
						setAddTagModal('edit')
						setValue('ch', params.row.ch)
						setValue('en', params.row.en)
						setValue('id', params.row.id)
					}}/>,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => {
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
      path: "/tags/list",
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
			tagColumn
		)) as any;

		if (!active) {
			return;
		}

		setRows(newRows.data);
		setLoading(false);
	}

  React.useEffect(() => {
    let active = true;

    refresh(active)

    return () => {
      active = false;
    };
  }, [paginationModel.page, tagColumn]);

  const renderConfirmDialog = () => {
    if (!dialogParams) {
      return null;
    }

    const handleNo = () => {
      setDialogParams(null);
    };

    return (
      <Dialog sx={{ m: 0, p: 2 }} open={!!dialogParams}>
        <DialogTitle>确认提示</DialogTitle>
        <DialogContent dividers>
          {`确定要删除？${dialogParams.row.ch}`}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo}>不</Button>
          <LoadingConfirmBtn
            action={async () =>
              await action({
                path: "/tags/delete",
                params: {
                  id: dialogParams.id,
                },
              })
            }
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

  const {
    register,
    handleSubmit,
    watch,
		setValue,
    formState: { errors },
  } = useForm<any>();

  const onSubmit: SubmitHandler<any> = async (data) => {
		setModalLoading(true)
		try{
			addTagModal === 'edit' ? await action({
				path:'/tags/edit',
				params:{
					...data,
					id:data.id
				}
			}) :
			await action({
				path:'/tags/add',
				params:data
			})
			setModalLoading(false)
			setAddTagModal(false)
			refresh(true)
		}catch(e){
			setModalLoading(false)
		}
	}

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
            setAddTagModal('add');
          }}
        >
          新建标签
        </Button>
      </Stack>
      <DataGrid
        rows={rows}
        columns={tagColumn}
        pagination
        checkboxSelection
        paginationModel={paginationModel}
        pageSizeOptions={[5]}
        rowCount={100}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        loading={loading}
        keepNonExistentRowsSelected
      />
      <Dialog open={!!addTagModal} onClose={() => setAddTagModal(false)}>
        <DialogTitle>{addTagModal === 'add' ? '添加' : '编辑' }标签</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register("ch")}
              autoFocus
              margin="dense"
              id="ch"
              label="中文名"
              fullWidth
              variant="standard"
            />
            <TextField
              {...register("en")}
              autoFocus
              margin="dense"
              id="en"
              label="英文名"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddTagModal(false)}>关闭</Button>
            <LoadingButton loading={modalLoading} component="label" variant="contained">
							确定
              <VisuallyHiddenInput type="submit" />
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default TagList;
