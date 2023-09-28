import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from '@mui/icons-material/Save';

const LoadingConfirmBtn = ({text = '保存',action,callback,...rest}) => {

	const [loading,setLoading] = React.useState(false)

  return (
    <LoadingButton
      loading={loading}
      loadingPosition="start"
      startIcon={<SaveIcon />}
      variant="outlined"
			onClick={async () => {
				setLoading(true)
				const result = await action() as any
				await callback(result)
				setLoading(false)
			}}
      {...rest}
    >
      {text}
    </LoadingButton>
  );
};

export default LoadingConfirmBtn;
