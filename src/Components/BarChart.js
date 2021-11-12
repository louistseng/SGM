import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default class BarChart extends React.Component {


    constructor(props) {
        super(props);

        this.state = {

            series: [
                {
                    data: [1380, 1200, 1100, 690, 580, 540, 448, 430, 470, 400],
                }
            ],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: {
                        show: false,
                    }
                },
                fill: {
                    colors: [this.getBarColor(props.type)]
                },
                grid: {
                    show: false
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: true,
                        dataLabels: {
                            position: 'top'
                          },
                    }
                },
                dataLabels: {
                    enabled: true,
                    position: 'start' ,
                    offsetX: 35,
                },
                xaxis: {
                    categories: ['臺北市', '新北市', '臺北市', '臺北市', '臺北市', '臺北市', '臺北市',
                        '臺北市', '臺北市', '臺北市'
                    ],
                    labels: {
                        show: false
                    },
                    axisTicks: {
                        show: false,
                    },
                    axisBorder: {
                        show: false,
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            colors: "#FAFAFA"
                        }
                    },
                },
                tooltip: {
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        return (
                            '<div class="myTooltip">' +
                            "<span>" +
                            w.globals.labels[dataPointIndex] +
                            `<div class="tooltop-data"><div class="middle-area"><p class="tooltip-Content">列管事業場址數</p>` +
                             `<br/><p class="tooltip-Content">共${series[seriesIndex][dataPointIndex]}處，其中</p></div>`+
                             `<br/><p class="tooltip-Content">◆工廠${Math.floor(series[seriesIndex][dataPointIndex]/3)}處</p>` + `<br/><p class="tooltip-Content">◆加油站${Math.floor(series[seriesIndex][dataPointIndex]/3)}處</p>` + 
                             `<br/><p class="tooltip-Content">◆非法棄置${Math.floor(series[seriesIndex][dataPointIndex]/3)}處</p></div>` +
                            "</span>" +
                            "</div>"
                        );
                    }
                },
            }
        };
    }

    //bar的顏色
    getBarColor(type) {
        switch (type) {
            case 1:
                return '#A9D18E';
            case 2:
                return '#70AD47';
            case 3:
                return '#19F3C4';
            case 4:
                return '#08A07F';
            default:
                return '#A9D18E';
        }
    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
            </div>
        );
    }
}