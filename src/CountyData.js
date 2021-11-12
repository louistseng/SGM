import React, { useRef, useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { ReactComponent as TaiwanSVG } from './taiwanMap.svg'
import ReactApexChart from 'react-apexcharts';
import { addComma } from './utils/Functions';
import './CountyData.scss';
import { select } from "d3";
import PieChart from './Components/PieChart';
import BarChart from './Components/BarChart';
import LittlePieChart from './Components/LittlePieChart';

function CountyData() {

    var DateTime = new Date();
    const Today = DateTime.getFullYear() + " 年 " + (DateTime.getMonth()+1) + " 月 " + DateTime.getDate() + " 日"
    const [sum, setSum] = useState(8790)
    const [hoverdLabel, setHoverdLabel] = useState('累積公告場址')
    const [showPie, setShowPie] = useState(false)
    const [addYear, setAddYear] = useState(0)
    const [countStop, setCountStop] = useState(false)
    const [clickDetail, setClickDetail] = useState(false)
    const [type, setType] = useState(0);

    let currentYear = new Date().getFullYear() - 1911
    const beginYear = 101

    /*甜甜圈圖圖config*/
    //套件文件: https://apexcharts.com/docs/chart-types/pie-donut/
    let options = {
        fontFamily: "Microsoft JhengHei",
        labels: ["列管中場址", "累積改善解列場址"],
        colors: ['#ffe6993b', '#10dad738'],
        series: [1789, 7001],
        animationEnabled: true,
        legend: {
            show: false,
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: ['#FFE699', '#10DBD8'],
            width: 3,
            dashArray: 0,
        },
        plotOptions: {
            pie: {
                startAngle: 30,
                enabled: true,
                donut: {
                    size: "65%",
                },
                dataLabels: {
                    enabled: true,
                    offset: 60,
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                console.log(val, opts)
                return [opts.w.globals.seriesNames[opts.seriesIndex], opts.w.globals.series[opts.seriesIndex] + "處", "(" + val.toFixed() + "%" + ")"]
            },
            style: {
                colors: ["#FFC700", "#10DCD9"],
                fontFamily: "W5-font",
            },

        },
        total: {
            show: true,
        },
        chart: {
            events: {
                dataPointMouseEnter: function (chartContext, seriesIndex, config) {
                    var index = config.dataPointIndex
                    var value = config.w.globals.series[index]
                    var labelName = config.w.globals.labels[index]
                    setSum(value)
                    setHoverdLabel(labelName)
                },
                dataPointMouseLeave: function (event, chartContext, config) {
                    setSum(8790)
                    setHoverdLabel('累積公告場址')
                },
                dataPointSelection: function (event, chartContext, config) {
                    console.log(config.dataPointIndex)
                    if (config.dataPointIndex === 0) {
                        setShowPie(true)
                    } else {
                        setShowPie(false)
                        setClickDetail(false)
                    }
                },
                legendClick: function (chartContext, seriesIndex, config) {
                    var index = seriesIndex
                    var value = config.config.series[index]
                    var labelName = config.config.labels[index]
                    setSum(value)
                    setHoverdLabel(labelName)

                },
                animationEnd: setTimeout(function () {
                    setShowPie(true)
                }, 1000),
            }
        }
    }

    //call後端api
    //   const [fetchData, setFetchData] = useState([]);
    //   const fetchBarData = async () => {
    //       const targetUrl = `${SSL}/${domain}/api/url`

    //       const response = await fetch(targetUrl, {
    //           method: "GET",
    //           headers: {
    //               "Content-Type": "application/json; charset=utf-8",
    //           }
    //       })
    //       const json = await response.json()
    //       const fetchBarData = json.case_img_statistics_all
    //       setFetchData(json.case_img_statistics_all)
    //   }

    //用cityId在後端回傳的cityReports(json)中該縣市的資料
    const getCityData = (id) => {
        // var index = cityReports.findIndex(city => city.cityId === pad(id))
        // if (index !== -1) {
        //     return cityReports[index]
        // }
    }

    //地圖d3
    var d3 = require("d3");
    const svgRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        const svg = select(svgRef.current);
        svg
            .style("position", "relative")
            .selectAll('.section')
        //定義縣市小標籤
        const tooltipSvg = select(tooltipRef.current);
        var tooltip = tooltipSvg
            .append("div")
            .attr("class", "myTooltip")
            .style("position", "absolute")
            .style("opacity", "0")
            .style("transition", "all .3s")
        //滑鼠移到縣市的時候顯示小標籤
        svg
            .selectAll('.section')
            .on("mouseover", function (d) {
                tooltip.style("opacity", "1");
                tooltip
                    .style("top", (d.clientY) + "px")
                    .style("left", (d.clientX - 1200) < 0 ? (d.clientX - 700) + "px" : (d.clientX - 1200) + "px")
                    //接到後端資料後, 可以直接塞 ${getCityData(d.target.id).total} 到下方html裡面
                    .html(decodeURIComponent(JSON.parse(`"${d3.select(this).attr("name")}"`)) + `<br/><div class="tooltop-data"><div class="middle-area"><p class="tooltip-Content">列管事業場址數</p>` + `<br/><p class="tooltip-Content">共100處，其中</p></div>` + `<br/><p class="tooltip-Content">◆工廠_處</p>` + `<br/><p class="tooltip-Content">◆加油站_處</p>` + `<br/><p class="tooltip-Content">◆非法棄置_處</p></div>`)
                d3.select(this)
                    .classed("hovered", true)
                svg
                    .selectAll('.section')
                    .filter(function () {
                        return !this.classList.contains('myTooltip-map') && !this.classList.contains('hovered')
                    })
                    .style("opacity", ".1")

            })
            .on("mouseout", function () {
                tooltip.style("opacity", "0")
                d3.selectAll(".myTooltip-map").attr("visibility", "hidden")
                svg.selectAll('.section')
                    .style("opacity", "1")
                    .classed("hovered", false)
            })
            //手機版
            .on("click", function () {
                tooltip.style("opacity", "0")
                d3.selectAll(".myTooltip-map").attr("visibility", "hidden")
                //.classed("myTooltip-map", false)
                svg.selectAll('.section')
                    .style("opacity", "1")
                    .classed("hovered", false)
            });
    });


    //時光飛梭
    useEffect(() => {
        if (addYear && !countStop)
            var timer = setTimeout(() => {
                if (addYear + beginYear === currentYear) {
                    setAddYear(0)
                } else {
                    setAddYear(addYear + 1)
                }
            }, 1000);
        return () => clearTimeout(timer);
    }, [addYear, countStop]);

    const startCounter = () => {
        setAddYear(addYear + 1)
        setCountStop(false)

    };
    const stopCounter = () => {
        setAddYear(addYear)
        setCountStop(true)
    };

    //時光飛梭bar長度-決定每秒軸要移動多少
    const parentWidth = useCallback((elem) => {
        return elem?.parentElement.clientWidth
    }, [])

    const controledTable = (
        <>
            <tr style={{ background: "#5E7594" }}>
                <td data-title="場址類別" className="">事業場址</td>
                <td data-title="面積占比" className="">76.07%</td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">工廠</td>
                <td data-title="面積占比" className="">46.73%</td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">軍事場址</td>
                <td data-title="面積占比" className="">14.71%</td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">其他</td>
                <td data-title="面積占比" className="">9.07%</td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">儲槽</td>
                <td data-title="面積占比" className="">3.10%</td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">加油站</td>
                <td data-title="面積占比" className="">1.72%</td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">非法棄置場址</td>
                <td data-title="面積占比" className="">0.74%</td>
            </tr>
            <tr style={{ background: "#5E7594" }}>
                <td data-title="場址類別" className="">農場場址</td>
                <td data-title="面積占比" className="">23.93%</td>
            </tr>
        </>
    )

    return (
        <div className="countyData-container container">
            <div className="d-flex row">
                <div className="left-side col-sm-12 col-md-12 col-lg-6">
                    <div className="d-flex">
                        <div>
                            <div className="circle-with-data">
                                <div className="text-container">
                                    <a href="http://google.com">
                                    <h6 className="circle-inner-text">列管中</h6>
                                    <h6 className="circle-inner-text">場址面積</h6>
                                    <h6 className="circle-inner-text number">{addComma(1580.62)}</h6>
                                    <h6 className="circle-inner-text">公頃</h6>
                                    </a>
                                </div>
                            </div>

                            <table className="site-table">
                                <div className="bar-with-circle"></div>
                                <thead className="site-table-head">
                                    <tr>
                                        <th>場址類別</th>
                                        <th>面積占比</th>
                                    </tr>
                                </thead>
                                <tbody className="site-table-body">
                                    {controledTable}
                                </tbody>
                            </table>

                        </div>
                        <div>
                            <div className="circle-with-data">
                                <div className="text-container">
                                    <h6 className="circle-inner-text">累計</h6>
                                    <h6 className="circle-inner-text">改善解列進度</h6>
                                    <h6 className="circle-inner-text number">76.57%</h6>
                                </div>
                            </div>
                            <div className="tooltip-total-container" id="tooltip-total-container">
                                <div className="bar-with-circle"></div>
                                <h5 className="tooltip-total-title">累積改善解列場址</h5>
                                <div className="align-container">
                                    <h4>7,442</h4>
                                    <h6 className="tooltip-total-subtitle">處</h6>
                                </div>
                                <h5 className="tooltip-total-title">場址類別</h5>
                                <div className="release-container">
                                    <div className="release-single-container">
                                        <h6 className="tooltip-total-subtitle">農地</h6>
                                        <div className="align-container">
                                            <h4>6,415</h4>
                                            <h6 className="tooltip-total-subtitle">處</h6>
                                        </div>
                                    </div>
                                    <LittlePieChart />
                                    <div className="release-single-container">
                                        <h6 className="tooltip-total-subtitle">事業</h6>
                                        <div className="align-container">
                                            <h4>1,027</h4>
                                            <h6 className="tooltip-total-subtitle">處</h6>
                                        </div>
                                    </div>
                                </div>
                                <h5 className="tooltip-total-title">解除列管狀態</h5>
                                <div className="release-container">
                                    <div className="release-single-container">
                                        <h6 className="tooltip-total-subtitle">七條五(含細八)</h6>
                                        <div className="align-container">
                                            <h4>766</h4>
                                            <h6 className="tooltip-total-subtitle">處</h6>
                                        </div>
                                    </div>
                                    <div className="release-single-container">
                                        <h6 className="tooltip-total-subtitle">控制場址</h6>
                                        <div className="align-container">
                                            <h4>6,652</h4>
                                            <h6 className="tooltip-total-subtitle">處</h6>
                                        </div>
                                    </div>
                                    <div className="release-single-container">
                                        <h6 className="tooltip-total-subtitle">整治場址</h6>
                                        <div className="align-container">
                                            <h4>24</h4>
                                            <h6 className="tooltip-total-subtitle">處</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="donut-container">
                    </div>
                    {showPie && <PieChart clickDetail={clickDetail} setClickDetail={setClickDetail} />}
                    <div className="donutChart" >
                        <ReactApexChart
                            options={options}
                            series={options.series}
                            type="donut"
                            width={300}
                            className="donut-chart"
                        />
                        <div className="innerText"><div className="number-container">{hoverdLabel}&nbsp;<div className="sunburstValue">{sum}</div>處</div></div>
                    </div>
                </div>
                <div className="right-side col-sm-12 col-md-12 col-lg-6">
                    <h3>各縣市列管事業場址數</h3>
                    <h5>統計數據包含全臺各縣市各年度區間列管之事業場址數，</h5>
                    <h5>其中未納入地下水限制使用地區場址數，<span className="number-w5">{beginYear + addYear}年</span>全台共有<span className="number-w5 with-underline">10</span>處事業場址數</h5>
                    <div className="timerBar-and-text">
                        <h3 className="number-w5">{beginYear + addYear}年</h3>
                        <div className="progressBar" id="map-timeBar">
                            <div className="anchor" style={{ transform: `translateX(${parentWidth(document.getElementById('map-timeBar')) * .7 / (currentYear - beginYear) * addYear}px)` }}></div>
                        </div>

                        <div className="progress-btn" onClick={() => stopCounter()}>
                            <i className="fas fa-pause" onClick={() => stopCounter}></i>
                        </div>
                        <div className="progress-btn" onClick={() => startCounter()}>
                            <i className="fas fa-play"></i>
                        </div>
                    </div>
                    <div ref={tooltipRef}></div>
                    <TaiwanSVG ref={svgRef} className="taiwan-svg" alt="taiwan-svg" />
                </div>

            </div>
            <div className="barChart-container">
                <h3 className="barChart-title">事業場址列管及解列情形</h3>
                <div className="timerBar-and-text">
                    <h3>{beginYear + addYear}年</h3>
                    <div className="progressBar" id="barChart-timeBar">
                        <div className="anchor" style={{ transform: `translateX(${parentWidth(document.getElementById('barChart-timeBar')) * .7 / (currentYear - beginYear) * addYear}px)` }}></div>
                    </div>

                    <div className="progress-btn" onClick={() => stopCounter()}>
                        <i className="fas fa-pause" onClick={() => stopCounter}></i>
                    </div>
                    <div className="progress-btn" onClick={() => startCounter()}>
                        <i className="fas fa-play"></i>
                    </div>
                </div>
                <div className="labels-wrapper">
                    <div onClick={() => setType(1)} className="label-container">
                        <div className="label-circle" style={{ background: "#A9D18E" }}></div>
                        <p>公告為控制場址</p>
                    </div>
                    <div onClick={() => setType(2)} className="label-container">
                        <div className="label-circle" style={{ background: "#70AD47" }}></div>
                        <p>公告解除控制場址</p>
                    </div>
                    <div onClick={() => setType(3)} className="label-container">
                        <div className="label-circle" style={{ background: "#19F3C4" }}></div>
                        <p>公告為整治場址</p>
                    </div>
                    <div onClick={() => setType(4)} className="label-container">
                        <div className="label-circle" style={{ background: "#08A07F" }}></div>
                        <p>公告解除整治場址</p>
                    </div>
                </div>
                <BarChart key={type} type={type} setType={setType} />
                <div className="barChart-note">
                    <div><p className="note-label"><i class="fas fa-tint"></i>&nbsp;點選縣市長條圖，可瞭解各場址類別場址數</p></div>
                    <div><p className="note-label">{Today}</p></div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(CountyData);