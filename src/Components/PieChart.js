import React from "react";
import ReactApexChart from "react-apexcharts";

export default function ApexChart(props) {

  const { enterpriseSite, enterprise, enterpriseTotal, farmSite, clickDetail, setClickDetail } = props;

  let options = {
    colors: ["#FFE699", "#ffe6993b"],
    labels: ["事業", "農地"],
    series: [enterpriseTotal, farmSite[0]],
    plotOptions: {
      pie: {
        startAngle: 30,
        endAngle: 360,
        dataLabels: {
          enabled: true,
          offset: 50,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        // console.log(val, opts);
        return [
          opts.w.globals.seriesNames[opts.seriesIndex],
          opts.w.globals.series[opts.seriesIndex] + "處",
          "(" + val.toFixed() + "%" + ")",
        ];
      },
      style: {
        colors: ["#FFE699", "#FFC700"],
        fontFamily: "W5-font",
        fontSize: "12px",
        fontWeight: "300",
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: "#FFE699",
      width: 5,
      dashArray: 0,
    },
    legend: {
      show: false,
    },
    chart: {
      type: "pie",
      animations: false,
      events: {
        dataPointSelection: function (event, chartContext, config) {
          // console.log(config.dataPointIndex);
          if (config.dataPointIndex === 0) {
            setClickDetail(true);
          } else {
            setClickDetail(false);
          }
        },
        animationEnd: setTimeout(function () {
          setClickDetail(true);
        }, 1000),
      },
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
          },
        },
      },
    ],
  };

  return (
    <div id="piechart">
      <ReactApexChart
        options={options}
        series={options.series}
        type="pie"
        width="100%"
        height="180px"
      />
      {clickDetail && (
        <div className="pieChart-detail">
          <div className="detail-top-square" style={{ height: `${enterprise[2]}` }}>
            <p>{enterprise[2]}</p>
            <div className="note-and-before">
              <div className="square-note">工廠{enterpriseSite[2]}處</div>
            </div>
          </div>
          <div className="detail-top-square" style={{ height: `${enterprise[0]}` }}>
            <p>{enterprise[0]}</p>
            <div className="note-and-before">
              <div className="square-note">加油站{enterpriseSite[0]}處</div>
            </div>
          </div>
          <div className="detail-top-square" style={{ height: `${enterprise[5]}` }}>
            <p>{enterprise[5]}</p>
            <div className="note-and-before">
              <div className="square-note">其他{enterpriseSite[5]}處</div>
            </div>
          </div>
          <div className="detail-top-square" style={{ height: `${enterprise[3]}` }}>
            <p>{enterprise[3]}</p>
            <div className="note-and-before">
              <div className="square-note">非法棄置場址{enterpriseSite[3]}處</div>
            </div>
          </div>
          <div className="detail-top-square" style={{ height: `${enterprise[1]}` }}>
            <p>{enterprise[1]}</p>
            <div className="note-and-before">
              <div className="square-note">儲槽{enterpriseSite[1]}處</div>
            </div>
          </div>
          <div className="detail-top-square" style={{ height: `${enterprise[4]}` }}>
            <p>{enterprise[4]}</p>
            <div className="note-and-before">
              <div className="square-note">軍事場址{enterpriseSite[4]}處</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
