import React from 'react';
import {Dialog,DialogTitle,DialogContent,DialogActions,Button} from "@mui/material";
import LoadingConfirmBtn from "components/LoadingConfirmBtn";
import action from "request/action";

const FormDialog = (props,ref) => {

  const [dialogParams, setDialogParams] = React.useState<any>(null)

  React.useImperativeHandle(ref, () => ({
    openDialog,
    closeDialog,
  }));

  const openDialog = (params) => {
    setDialogParams(params);
  };

  const closeDialog = () => {
    setDialogParams(null);
  }

  return <Dialog
    sx={{ m: 0, p: 2 }}
    // TransitionProps={{ onEntered: handleEntered }}
    open={!!dialogParams}
  >
    {/* <DialogTitle>确认提示</DialogTitle>
    <DialogContent dividers>
      {`确定要删除？${dialogParams.row.name}`}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => {
        setDialogParams(null)
      }}>不</Button>
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
          setDialogParams(null)
        }}
      />
    </DialogActions> */}
  </Dialog>
}

export default FormDialog;
