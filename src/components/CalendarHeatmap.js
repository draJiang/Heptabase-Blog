import React, { useState, useEffect, useRef, useUrlState } from 'react';

import Tooltip from '@uiw/react-tooltip';
import HeatMap from '@uiw/react-heat-map';

import { getHeptabaseData } from '../constantFunction'

import '../style.css'

let heptabase_blog_data = undefined

let cards = undefined
let myValue = []
let dateList = []


console.log(heptabase_blog_data);

const CalendarHeatmap = () => {

  // 开始时间
  let sd = new Date() //今天
  sd.setFullYear(sd.getFullYear() - 1) //一年前的今天

  const [startDate, setStartDate] = useState(sd);
  const [value, setValue] = useState();


  useEffect(() => {
    // 处理 Hepta 数据

    // 获取 Heptabase 数据
    if (myValue.length <= 0) {
      getHeptabaseData().then((res) => {

        heptabase_blog_data = res.data
        console.log('CalendarHeatmap getHeptabaseData');

        cards = heptabase_blog_data['cards']
        for (let i = cards.length - 1; i > -1; i--) {

          //将 TZ 时间转为本地时间 yyyy-mm-dd
          let date = new Date(cards[i]['lastEditedTime']),
            month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();

          if (month.length < 2)
            month = '0' + month;
          if (day.length < 2)
            day = '0' + day;

          let dateStr = [year, month, day].join('/');

          // 判断 value 中是否有此时间，有则追加 count
          if (dateList.indexOf(dateStr) > -1) {
            myValue[dateList.indexOf(dateStr)]['count'] += 1
          } else {
            myValue.push({ 'date': dateStr, 'count': 1 })
            dateList.push(dateStr)
          }

        }

        setValue(myValue)
        console.log('setValue(myValue)');

      })
    } else if (value === undefined) {
      setValue(myValue)
    }
    setMapWidth()

  })

  const setMapWidth = () => {
    let windowWidth = window.innerWidth
    // console.log(windowWidth);

    let heatmapDiv = document.getElementsByClassName('calendarHeatmap')[0]
    // console.log(heatmapDiv);
    if (heatmapDiv === undefined) {
      return
    }

    // 调整 map 的尺寸

    if (windowWidth >= 780 && heatmapDiv.getAttribute('map-width') !== '12') {

      let sd = new Date() // 今天
      sd.setMonth(sd.getMonth() - 12) // x 个月前的今天
      setStartDate(sd)

      //标记样式
      heatmapDiv.setAttribute('map-width', '12')
    }

    if (windowWidth >= 680 && windowWidth < 780 && heatmapDiv.getAttribute('map-width') !== '10') {

      let sd = new Date() // 今天
      sd.setMonth(sd.getMonth() - 10) // x 个月前的今天
      setStartDate(sd)

      //标记样式
      heatmapDiv.setAttribute('map-width', '10')
    }

    if (windowWidth >= 580 && windowWidth < 680 && heatmapDiv.getAttribute('map-width') !== '9') {

      let sd = new Date() // 今天
      sd.setMonth(sd.getMonth() - 9) // x 个月前的今天
      setStartDate(sd)

      //标记样式
      heatmapDiv.setAttribute('map-width', '9')
    }

    if (windowWidth >= 480 && windowWidth < 580 && heatmapDiv.getAttribute('map-width') !== '7') {

      let sd = new Date() // 今天
      sd.setMonth(sd.getMonth() - 7) // x 个月前的今天
      setStartDate(sd)

      //标记样式
      heatmapDiv.setAttribute('map-width', '7')
    }

    if (windowWidth >= 375 && windowWidth < 480 && heatmapDiv.getAttribute('map-width') !== '6') {

      let sd = new Date() // 今天
      sd.setMonth(sd.getMonth() - 6) // x 个月前的今天
      setStartDate(sd)

      //标记样式
      heatmapDiv.setAttribute('map-width', '6')
    }

    if (windowWidth < 375 && heatmapDiv.getAttribute('map-width') !== 'small') {

      let sd = new Date() // 今天
      sd.setMonth(sd.getMonth() - 4) // x 个月前的今天
      setStartDate(sd)

      //标记样式
      heatmapDiv.setAttribute('map-width', 'small')
    }
  }


  window.addEventListener("resize", (event) => {

    setMapWidth()

  });


  return (
    <div className='calendarHeatmap'>
      <HeatMap
        value={value}
        width={'100%'}
        // panelColors={{ 0: '#EBEDF0', 8: '#7BC96F', 4: '#C6E48B', 12: '#239A3B', 32: '#196127' }}
        startDate={startDate}
        endDate={new Date()}
        weekLabels={false}
        legendCellSize={0}
        rectRender={(props, data) => {
          // if (!data.count) return <rect {...props} />;
          return (
            <Tooltip key={props.key} autoAdjustOverflow={true} visibleArrow={false} placement="left" content={`numbers of cards: ${data.count || 0} on ${data.date}`}>
              <rect {...props} />
            </Tooltip>
          );
        }}

      />
    </div>
  )
};
export default CalendarHeatmap