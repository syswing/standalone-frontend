import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import { Box } from "@mui/system";
import { Avatar, Button } from "@mui/material";
import AvatarImg from "@/images/WechatIMG115.jpeg";
import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import shadows from "@mui/material/styles/shadows";
import Dashboard from "../Dashboard";
import emotionStyled from "@emotion/styled";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "./NavBar";
import { setBingPic } from "../../store/bingPic";
import action from '../../request/action'
import { useDispatch, useSelector } from 'react-redux'

const bounceOut = keyframes`
	0%{ box-shadow: ${shadows[2]}; transform: scale(1.1, 1.1);}
	25%{ box-shadow: ${shadows[3]}; transform: scale(0.9, 0.9);}
	50%{ box-shadow: ${shadows[4]}; transform: scale(1.2, 1.2); }
	75%{ box-shadow: ${shadows[5]}; transform: scale(1.1, 1.1);}
	100%{ box-shadow:${shadows[3]}; transform: scale(1, 1);}
`;

const Quote = emotionStyled.i(({ float }: any) => {
  return {
    wordBreak: "keep-all",
    fontWeight: "800",
    display: "inline-block",
    float: float || "left",
  };
});

const PositionDiv = (props) => {
  return <div className={props.className}>{props.children}</div>;
};
const PositionDivWarp = styled(PositionDiv)<any>(({ left, top, color }) => {
  return {
    position: "absolute",
    left: left,
    top: top,
    transform: "translate(-50%,-50%)",
    color: color,
  };
});

const BounceAvatar = styled(Avatar)<any>(() => {
  return {
    "&:hover": {
      animation: `${bounceOut} .8s linear`,
    },
  };
});
const barTheme = createTheme({
  palette: {
    primary: {
      main: "rgba(255, 255, 255, 0.1)",
    },
  },
});

const BackgroundBar = ({showTopBar}) => {
	const dispatch = useDispatch()
	const bingPic = useSelector((state:any) => state.bingPicSliceReducer.bingPic)

	const currentPic = useSelector((state:any) => state.bingPicSliceReducer.current)

  useEffect(() => {
    const fetchBingPic = async () => {
      const result = await action({
        path: "/BingPic/bingPic",
      });
      dispatch(setBingPic(result.data));
    };
    fetchBingPic()
  },[])

  return (
    <>
      <PositionDivWarp left={"50%"} top={"170px"}>
        <BounceAvatar
          sx={{ width: 88, height: 88 }}
          alt="syswing"
          src={AvatarImg}
        />
        <PositionDivWarp style={{
          width:'20em'
        }} top={"180px"} left={"50%"} color={"white"}>
          <Quote>{bingPic.images[currentPic]?.copyright}</Quote>
          <Quote float="right">----{bingPic.images[currentPic]?.title}</Quote>
        </PositionDivWarp>
      </PositionDivWarp>
      <div
        style={{
          position: "fixed",
          zIndex: -1,
          top: 0,
        }}
      ></div>
      {bingPic?.images?.length && <TopBar drawSwitch={showTopBar}/>}
    </>
  );
};

const Layout = () => {

  const [showTopBar,setShowTopBar] = useState(false)

  return (
    <Box>
      <ThemeProvider theme={barTheme}>
        <AppBar position="static">
          <Toolbar
            style={{
              backdropFilter: "blur(8px)",
              background: "rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              position: "fixed",
              width: "100%",
							zIndex:'10'
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
							style={{marginRight:20}}
            >
              syswing
            </Typography>
						<NavBar showTopBar={showTopBar} handleChangeShowTopBar={(e) => {
              setShowTopBar(e.target.checked)
            }}/>
          </Toolbar>
        </AppBar>
        <BackgroundBar showTopBar={showTopBar}/>
        <Dashboard />
      </ThemeProvider>
    </Box>
  );
};

export default Layout;
