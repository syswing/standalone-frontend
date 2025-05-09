import React, { useState } from 'react'
import action from '../../../request/action';
// import data from './data.json'
export default () => {

  const [res, setRes] = useState<any>(null)
  // console.log('res',data)
  const TableDetections = res?.data.TableDetections[1].Cells.filter((item:any) => item.Confidence === 100)

  console.log('TableDetections',TableDetections)



  return <div 
    style={{
      height:'800px',
      overflow:'auto'
    }}
    className='px-3'
  >

    <input type="file" onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files || [];
      const res = await action({
        path:'/ocr/ocr',
        params:{
          image:files[0]
        } 
      })
      setRes(res)
      // console.log('res',data)
    }} />
    {/* <img src={res?.base64 || ''} /> */}
    <table>
      <tbody>
        {(() => {
          // 按RowBr分组
          const rowGroups = {};
          TableDetections?.forEach((item: any) => {
            if (!rowGroups[item.RowBr]) {
              rowGroups[item.RowBr] = [];
            }
            rowGroups[item.RowBr].push(item);
          });

          // 渲染每一行
          return Object.keys(rowGroups).map((rowIndex) => (
            <tr key={rowIndex}>
              {rowGroups[rowIndex].map((item: any, colIndex: number) => (
                <td key={`${rowIndex}-${colIndex}`}>{item.Text}</td>
              ))}
            </tr>
          ));
        })()}
      </tbody>
      
    </table>
  </div>
}

