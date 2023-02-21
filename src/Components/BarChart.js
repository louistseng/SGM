import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { totalData } from "../utils/Functions";

export default function BarChart(props) {

  const { fetchData, type } = props;

  //bar的顏色
  function getBarColor(type) {
    switch (type) {
      case 1:
        return "#A9D18E";
      case 2:
        return "#70AD47";
      case 3:
        return "#19F3C4";
      case 4:
        return "#08A07F";
      default:
        return "#A9D18E";
    }
  }

  const map = {};
  const result = fetchData.filter((item) => {
    if (map[item.AreaName] === undefined) {
      map[item.AreaName] = 1;
      return true
    } else {
      map[item.AreaName]++
      return false
    }
  });
  const quantityData = result.map((item, index) => {
    item.quantity = map[item.AreaName]
    return item;
  })

  const cityData = quantityData.map(data => data.AreaName)
  // console.log("city", cityData)

  function getData(string) {
    string = fetchData.filter((item, index) => {
      if (item.AreaName === string && item.Site_Kind !== "農地") {
        return item
      }
    });
    switch (type) {
      case 1:
        return string.map(item => item.Total_Control_Bulletin - item.Total_GW_Bulletin);
      case 2:
        return string.map(item => item.Total_Control_Free - item.Total_GW_Free);
      case 3:
        return string.map(item => item.Total_Rem_Bulletin);
      case 4:
        return string.map(item => item.Total_Rem_Free);
      default:
        return string.map(item => item.Total_Control_Bulletin - item.Total_GW_Bulletin);
    }
  };
  let totalNum = []
  cityData.forEach((item) => {
    totalNum.push(totalData(getData(item)))
  });

  let newCityData = cityData.map((item, index) => {
    return { city: item, value: totalNum[index] }
  })

  newCityData.sort((a, b) => {
    if (a.value < b.value) {
      return 1;
    }
    if (a.value > b.value) {
      return -1;
    }
    return 0;
  })
  // console.log("total", newCityData.map(data => data.value))
  // console.log("total", newCityData.map(data => data.city))

  let options = {
    series: [
      {
        data: newCityData.map(data => data.value > 0 ? data.value : 0),
      },
    ],
    chart: {
      type: "bar",
      height: 800,
      toolbar: {
        show: false,
      }
    },
    fill: {
      colors: [getBarColor(type)],
    },
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      position: "start",
      offsetX: 35,
    },
    xaxis: {
      categories: newCityData.map(data => data.city),
      labels: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#FAFAFA",
        },
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {

        const bulletinFilter = fetchData.filter((item) => {
          if (item.AreaName === w.globals.labels[dataPointIndex] && item.Site_Kind !== "農地") {
            return item;
          }
        });
        // console.log(bulletinFilter)
        const bulletinMap = bulletinFilter.map((item) => {
          switch (type) {
            case 1:
              return item.Total_Control_Bulletin - item.Total_GW_Bulletin;
            case 2:
              return item.Total_Control_Free - item.Total_GW_Free;
            case 3:
              return item.Total_Rem_Bulletin;
            case 4:
              return item.Total_Rem_Free;
            default:
              return item.Total_Control_Bulletin - item.Total_GW_Bulletin;
          }
        });
        const bulletinData = totalData(bulletinMap);
        // console.log("bulletinData", bulletinMap, bulletinMap[0])

        return (
          '<div class="myTooltip">' +
          "<span>" +
          w.globals.labels[dataPointIndex] +
          `<div class="tooltop-data"><div class="middle-area"><p class="tooltip-Content">${type === 1 || type === 3 ? "列管事業場址數" : "解除列管事業場址數"}</p>` +
          `<br/><p class="tooltip-Content">共${bulletinData}處，其中</p></div>` +
          `<br/><p class="tooltip-Content">◆加油站${bulletinMap[0]}處</p>` +
          `<br/><p class="tooltip-Content">◆儲槽${bulletinMap[1]}處</p>` +
          `<br/><p class="tooltip-Content">◆工廠${bulletinMap[2]}處</p>` +
          `<br/><p class="tooltip-Content">◆其他${bulletinMap[5]}處</p>` +
          `<br/><p class="tooltip-Content">◆軍事場址${bulletinMap[4]}處</p>` +
          `<br/><p class="tooltip-Content">◆非法棄置${bulletinMap[3]}處</p></div>` +
          "</span>" +
          "</div>"
        );
      }
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={options.series}
        type="bar"
        height={800}
      />
    </div>
  );
}
