import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default function LittlePieChart(props) {

    const { siteFree, totalFreeSite } = props
    const enterpriseFree = totalFreeSite - siteFree[0]

    /*累積改善解列-小甜甜圈圖圖*/
    let options = {
        fontFamily: "Microsoft JhengHei",
        labels: ["事業", "農地"],
        colors: ['#F75029', '#ecd23c'],
        series: [enterpriseFree, siteFree[0]],
        animationEnabled: true,
        legend: {
            show: false,
        },
        stroke: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        total: {
            show: true,
        },
    }

    return (


        <div id="chart">
            <ReactApexChart
                options={options}
                series={options.series}
                type="donut"
                width={100}
            />

        </div>
    )

}