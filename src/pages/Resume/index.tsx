import React, { useEffect } from "react";
import "./resume.css";
import { useDispatch, useSelector } from "react-redux";
import action from "../../request/action";
import { setBingPic } from "../../store/bingPic";

import AvatarImg from "@/images/WechatIMG115.jpeg";

const Resume = () => {
  const currentPic = useSelector(
    (state: any) => {
			return state.bingPicSliceReducer.bingPic
		}
  );
  console.log("currentPic", currentPic);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchBingPic = async () => {
      const result = await action({
        path: "/BingPic/bingPic",
      });
      dispatch(setBingPic(result.data));
    };
    fetchBingPic();
  }, []);

  return (
    <div
      className="container"
      style={{  
        // backgroundImage: `url(https://cn.bing.com/${currentPic?.images?.[0]?.url})`,
				// backgroundSize:`cover`,
				// backgroundPosition:'center',
        // height:'100vh',
      }}
    >
      <div className='resume' style={{
        backgroundImage: `url(https://cn.bing.com/${currentPic?.images?.[0]?.url})`,
				backgroundSize:`cover`,
				backgroundPosition:'center',
        height:'100vh',
      }}>
        <div className="top">
          <div className="side background-mask">
            <div>
            <div className="title">
                <img src={AvatarImg} data-action="zoom"/>
                <h1>曹思逸的简历</h1>
            </div>
              <ul>
                <li>
                  <i className="icon-wechat"></i>
                  <span>csyswing</span>
                </li>
                <li>
                  <i className="icon-wechat"></i>
                  <span>csyswing</span>
                </li>
                <li>
                  <i className="icon-wechat"></i>
                  <span>csyswing</span>
                </li>
                <li>
                  <i className="icon-wechat"></i>
                  <span>csyswing</span>
                </li>
                <li>
                  <i className="icon-wechat"></i>
                  <span>csyswing</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="main background-mask">
            <li className="someRight">
              <dt><i className="icon-bookmark"></i>基本信息</dt>
              <dd><strong>个人信息:</strong> <span>曹思逸 / 男</span></dd>
              <dd><strong>毕业院校:</strong> <span>杭州电子科技大学</span></dd>
              <dd><strong>工作年限:</strong> <span>6年</span></dd>
              <dd><strong>常用ID:</strong> <span>syswing</span></dd>
              <dd><strong>GitHub:</strong> <a href="https://www.github.com/syswing" target="_blank">www.github.com/syswing</a>
              <iframe src="https://ghbtns.com/github-btn.html?user=syswing&type=follow&count=true" scrolling="0" width="170px" height="20px"></iframe></dd>
            </li>
          </div>
        </div>
      </div>

      <div className="content background-mask">
				<ul>
					<dt><i className="icon-bookmark"></i>项目与工作经验</dt>
				</ul>
			</div>

    </div>
  );
};

export default Resume;
