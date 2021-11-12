import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default class ApexChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [406, 1383],
            options: {
                colors: ['#FFE699', '#ffe6993b'],
                labels: ['事業', '農地'],
                plotOptions:{
                    pie:{
                        startAngle:30,
                    },
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, opts) {
                        console.log(val, opts)
                        return [opts.w.globals.seriesNames[opts.seriesIndex], opts.w.globals.series[opts.seriesIndex] + "處", "(" + val.toFixed() + "%" + ")"]
                    },
                    style: {
                        colors: ["#00145F", "#FFC700"],
                        fontFamily:"W5-font",
                        fontSize:"12px",
                        fontWeight:"300",
                    },
                },
                stroke: {
                    show: true,
                    curve: 'smooth',
                    lineCap: 'butt',
                    colors: '#FFE699',
                    width: 5,
                    dashArray: 0,
                },
                legend: {
                    show: false,
                },
                chart: {
                    type: 'pie',
                    events: {
                        dataPointSelection: function (event, chartContext, config) {
                            console.log(config.dataPointIndex)
                            if (config.dataPointIndex === 0) {
                                props.setClickDetail(true)
                            } else {
                                props.setClickDetail(false)
                            }
                        },
                        animationEnd: setTimeout(function () {
                            props.setClickDetail(true)
                        }, 1000),
                    }
                },
               
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom',
                            horizontalAlign: 'center',
                        }
                    }
                }]
            },


        };
    }

    render() {
        return (


            <div id="piechart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="pie" width="100%" height="180px" />
                {this.props.clickDetail &&
                    <div className="pieChart-detail">
                        <div className="detail-top-square" style={{ height: "63%" }}>
                            <p>63%</p>
                            <div className="note-and-before">
                                <div className="square-note">工廠255處</div>
                            </div>
                        </div>
                        <div className="detail-top-square" style={{ height: "25%" }}>
                            <p>25%</p>
                            <div className="note-and-before">
                                <div className="square-note">加油站104處</div>
                            </div>
                        </div>
                        <div className="detail-top-square" style={{ height: "12%" }}>
                            <p>12%</p>
                            <div className="note-and-before">
                                <div className="square-note">其他47處</div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}