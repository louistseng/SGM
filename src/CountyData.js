import React, { useRef, useEffect, useState, useCallback } from "react";
import { Link, withRouter } from "react-router-dom";
import { ReactComponent as TaiwanSVG } from "./taiwanMap.svg";
import ReactApexChart from "react-apexcharts";
import { addComma, totalData } from "./utils/Functions";
import "./CountyData.scss";
import { randomUniform, select } from "d3";
import PieChart from "./Components/PieChart";
import BarChart from "./Components/BarChart";
import LittlePieChart from "./Components/LittlePieChart";
import axios from "axios";
// import testData from './CityData.json'

function CountyData() {

    var DateTime = new Date();
    const Today =
        DateTime.getFullYear() +
        " 年 " +
        (DateTime.getMonth() + 1) +
        " 月 " +
        DateTime.getDate() +
        " 日";
    const [sum, setSum] = useState(0);
    const [hoverdLabel, setHoverdLabel] = useState("累積公告場址");
    const [showPie, setShowPie] = useState(true);
    const [addYear, setAddYear] = useState(0);
    const [countStop, setCountStop] = useState(false);
    const [clickDetail, setClickDetail] = useState(false);
    const [type, setType] = useState(0);

    const [accumulation, setAccumulation] = useState([]);
    const [fetchData, setFetchData] = useState([]);
    const [barData, setBarData] = useState([]);

    let currentYear = new Date().getFullYear() - 1911;
    const beginYear = 101;

    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
    };
    // const domain = "https://sgw.eri.com.tw";
    let SSL = window.location.protocol;
    let domain = window.location.hostname;

    useEffect(() => {
        document.title = "互動式議題平臺－污染場址狀態解析";
    }, []);

    // 年分資料
    useEffect(() => {
        const num = beginYear + addYear + 1911;
        const config = {
            method: "POST",
            url: `${SSL}//${domain}/ITPWeb/api/SiteSituationStatisticsByYear`,
            headers: headers,
            data: num,
        };
        axios(config)
            .then((res) => {
                // console.log("BYyear", JSON.parse(res.data));
                setFetchData(JSON.parse(res.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [addYear]);
    // console.log("barData", barData)

    // 單筆資料
    useEffect(() => {
        const config = {
            method: "POST",
            url: `${SSL}//${domain}/ITPWeb/api/SiteSituationStatistics
            `,
            headers: headers,
        };
        axios(config)
            .then((res) => {
                // console.log("累積/解列", JSON.parse(res.data))
                setAccumulation(JSON.parse(res.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [addYear]);

    // 列管中場址
    // 面積加總計算
    const totalControl = accumulation.map((data) => data.Site_Bulletin_Area - data.GW_Bulletin_Area);
    const totalControlSite = totalData(totalControl);

    //個別面積百分比計算
    const controlPercent = accumulation.map(data => (((data.Site_Bulletin_Area - data.GW_Bulletin_Area) / totalControlSite * 10000).toFixed()) / 100 + "%");

    //事業場址面積百分比計算
    const enterprisePercent = 100 - ((totalControl[0] / totalControlSite) * 10000).toFixed() / 100 + "%";
    // 列管中場址處加總計算
    const bulletinSite = accumulation.map((data) => data.Total_Site_Bulletin - data.Total_GW_Bulletin);
    const totalBulletinSite = totalData(bulletinSite);
    // console.log("累積列管", bulletinSite)
    const bulletinS = accumulation.map((data) => data.Site_Bulletin - data.GW_Bulletin);
    const bulletin_SB = totalData(bulletinS);
    // console.log("列管農", bulletinS)
    // 列管中場址農地和事業

    const enterpriseSite = bulletinS.filter((item, index) => index !== 0);
    const farmSite = bulletinS.filter((item, index) => index === 0);
    const enterpriseTotal = totalData(enterpriseSite);
    const enterprise = enterpriseSite.map(
        (data) => ((data / enterpriseTotal) * 10000).toFixed() / 100 + "%"
    );
    // console.log("enterpriseSite", enterpriseSite)
    // console.log("enterprise", enterprise)
    // ------------------------------------------------------------------------------------------------
    // 解列場址
    // 解列處加總
    const siteFree = accumulation.map((data) => data.Total_Site_Free - data.Total_GW_Free);
    const totalFreeSite = totalData(siteFree);
    // console.log("解列事業", totalFreeSite - siteFree[0])
    // console.log("解列農", siteFree[0])
    // 已解列場址在列管中場址中的百分比
    const freePercent = ((totalFreeSite / totalBulletinSite) * 10000).toFixed() / 100 + "%";
    // 細八加七條五場址處
    const freeLimitCope = accumulation.map(data => data.Total_Limit_Free).concat(accumulation.map(item => item.Total_Cope_Free))
    // 解列控制場址處
    const controlFree = accumulation.map((data) => data.Total_Control_Free);
    // 解列整治場址處
    const remFree = accumulation.map((data) => data.Total_Rem_Free);
    // ------------------------------------------------------------------------------------------------
    // 累積列管中和解列加總
    let accumulateBulletin = bulletinS.concat(siteFree);
    const bothSiteTotal = totalData(accumulateBulletin);
    // console.log("列管中", bulletinS);
    // ------------------------------------------------------------------------------------------------

    const enterpriseByYear = fetchData.filter((item, index) => item.Site_Kind !== "農地");
    const enterpriseByYearMap = enterpriseByYear.map((item) => {
        return item.Total_Control_Bulletin - item.Total_GW_Bulletin;
    });
    const enterpriseByYearLength = totalData(enterpriseByYearMap);
    // console.log("enterpriseByYearMap", enterpriseByYearMap)

    /*甜甜圈圖圖config*/
    //套件文件: https://apexcharts.com/docs/chart-types/pie-donut/
    let options = {
        fontFamily: "Microsoft JhengHei",
        labels: ["列管中場址", "累積改善解列場址"],
        colors: ["#ffe6993b", "#10dad738"],
        series: [bulletin_SB, totalFreeSite],
        animationEnabled: true,
        legend: {
            show: false,
        },
        stroke: {
            show: true,
            curve: "smooth",
            lineCap: "butt",
            colors: ["#FFE699", "#10DBD8"],
            width: 3,
            dashArray: 0,
        },
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                expandOnClick: true,
                customScale: 1,
                donut: {
                    size: "65%",
                },
                dataLabels: {
                    enabled: true,
                    offset: 80,
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                // console.log(val, opts)
                return [
                    opts.w.globals.seriesNames[opts.seriesIndex],
                    opts.w.globals.series[opts.seriesIndex] + "處",
                    "(" + val.toFixed() + "%" + ")",
                ];
            },
            style: {
                colors: ["#FFC700", "#10DCD9"],
                fontFamily: "W5-font",
                fontSize: "14px",
            },
        },
        total: {
            show: true,
        },
        chart: {
            animations: false,
            events: {
                dataPointMouseEnter: function (chartContext, seriesIndex, config) {
                    var index = config.dataPointIndex;
                    var value = config.w.globals.series[index];
                    var labelName = config.w.globals.labels[index];
                    setSum(value);
                    setHoverdLabel(labelName);
                },
                dataPointMouseLeave: function (event, chartContext, config) {
                    setSum(8790);
                    setHoverdLabel("累積公告場址");
                },
                dataPointSelection: function (event, chartContext, config) {
                    // console.log(config.dataPointIndex)
                    if (config.dataPointIndex === 0) {
                        setShowPie(true);
                    } else {
                        setShowPie(false);
                        setClickDetail(false);
                    }
                },
                legendClick: function (chartContext, seriesIndex, config) {
                    var index = seriesIndex;
                    var value = config.config.series[index];
                    var labelName = config.config.labels[index];
                    setSum(value);
                    setHoverdLabel(labelName);
                },
            },
        },
    };

    //地圖d3
    var d3 = require("d3");
    const svgRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        const svg = select(svgRef.current);
        svg.style("position", "relative").selectAll(".section");
        //定義縣市小標籤
        const tooltipSvg = select(tooltipRef.current);
        var tooltip = tooltipSvg
            .append("div")
            .attr("class", "myTooltip")
            .style("position", "absolute")
            .style("opacity", "0")
            .style("transition", "all .3s");
        svg
            .selectAll(".section")
            .on("mouseover", function (d) {

                const name = String(JSON.parse(`"${d3.select(this).attr("name")}"`));

                const bulletinFilter = fetchData.filter((item) => {
                    if (item.AreaName === name && item.Site_Kind !== "農地") {
                        return item;
                    }
                });
                const bulletinMap = bulletinFilter.map((item) => {
                    return item.Total_Control_Bulletin - item.Total_GW_Bulletin;
                });
                const bulletinData = totalData(bulletinMap);
                // console.log("bulletinData", bulletinData)

                function getData(string) {
                    string = fetchData.filter((item, index) => {
                        if (item.AreaName === name && item.Site_Kind === string) {
                            return item
                        }
                    });
                    return string.map(item => item.Total_Control_Bulletin - item.Total_GW_Bulletin)
                };

                const gas = totalData(getData('加油站'))
                const tank = totalData(getData('儲槽'))
                const factory = totalData(getData('工廠'))
                const other = totalData(getData('其他'))
                const military = totalData(getData('軍事場址'))
                const discard = totalData(getData('非法棄置場址'))

                tooltip.style("opacity", "1");
                tooltip
                    .style("top", d.clientY + "px")
                    .style(
                        "left",
                        d.clientX - 1200 < 0
                            ? d.clientX - 700 + "px"
                            : d.clientX - 1200 + "px"
                    )
                    //接到後端資料後, 可以直接塞 ${getCityData(d.target.id).total} 到下方html裡面
                    .html(
                        decodeURIComponent(
                            JSON.parse(`"${d3.select(this).attr("name")}"`)
                        ) +
                        `<br/><div class="tooltop-data"><div class="middle-area"><p class="tooltip-Content">列管事業場址數</p>` +
                        `<br/><p class="tooltip-Content">共${bulletinData}處，其中</p></div>` +
                        `<br/><p class="tooltip-Content">◆加油站${gas}處</p>` +
                        `<br/><p class="tooltip-Content">◆儲槽${tank}處</p>` +
                        `<br/><p class="tooltip-Content">◆工廠${factory}處</p>` +
                        `<br/><p class="tooltip-Content">◆其他${other}處</p>` +
                        `<br/><p class="tooltip-Content">◆軍事場址${military}處</p>` +
                        `<br/><p class="tooltip-Content">◆非法棄置${discard}處</p></div>`
                    );
                d3.select(this).classed("hovered", true);
                svg
                    .selectAll(".section")
                    .filter(function () {
                        return (
                            !this.classList.contains("myTooltip-map") &&
                            !this.classList.contains("hovered")
                        );
                    })
                    .style("opacity", ".1");
            })
            .on("mouseout", function () {
                tooltip.style("opacity", "0");
                d3.selectAll(".myTooltip-map").attr("visibility", "hidden");
                svg
                    .selectAll(".section")
                    .style("opacity", "1")
                    .classed("hovered", false);
            })
            //手機版
            .on("click", function () {
                tooltip.style("opacity", "0");
                d3.selectAll(".myTooltip-map").attr("visibility", "hidden");
                //.classed("myTooltip-map", false)
                svg
                    .selectAll(".section")
                    .style("opacity", "1")
                    .classed("hovered", false);
            });
    });

    //時光飛梭
    useEffect(() => {
        if (addYear && !countStop)
            var timer = setTimeout(() => {
                if (addYear + beginYear === currentYear) {
                    setAddYear(0);
                } else {
                    setAddYear(addYear + 1);
                }
            }, 800);
        return () => clearTimeout(timer);
    }, [addYear, countStop]);

    const startCounter = () => {
        if (addYear < 10) {
            setAddYear(addYear + 1);
            setCountStop(false);
        } else {
            setAddYear(0)
        }
    };
    // console.log(addYear)

    const stopCounter = () => {
        setAddYear(addYear);
        setCountStop(true);
    };

    //時光飛梭bar長度-決定每秒軸要移動多少
    const parentWidth = useCallback((elem) => {
        return elem?.parentElement.clientWidth;
    }, []);


    let max = 10;
    let initial = 0;
    let onChange = value => value.toFixed(0);


    const getPercentage = (current, max) => (100 * current) / max;

    const getValue = (percentage, max) => (max / 100) * percentage;

    const getLeft = percentage => `calc(${percentage}% - 5px)`;

    const initialPercentage = getPercentage(addYear, max);

    const sliderRefA = React.useRef();
    const thumbRefA = React.useRef();

    // console.log("a", sliderRefA, thumbRefA)

    const diffA = React.useRef();

    const handleMouseMoveA = (event) => {
        let newX =
            event.clientX -
            diffA.current -
            sliderRefA.current.getBoundingClientRect().left;

        const end =
            sliderRefA.current.offsetWidth - thumbRefA.current.offsetWidth;


        const start = 0;

        if (newX < start) {
            newX = 0;
        }
        if (newX > end) {
            newX = end;
        }

        const newPercentage = getPercentage(newX, end);
        const newValue = getValue(newPercentage, max);

        thumbRefA.current.style.left = getLeft(newPercentage);
        onChange(newValue);

        if (newValue > 0 || newValue < 10) {
            setAddYear(Number(newValue.toFixed(0)))
            setCountStop(true)
            // console.log(newValue.toFixed(0))
        } else {
            setAddYear(0)
        }

    };
    const handleMouseUpA = () => {
        document.removeEventListener('mouseup', handleMouseUpA);
        document.removeEventListener('mousemove', handleMouseMoveA);
    };

    const handleMouseDownA = event => {
        diffA.current =
            event.clientX - thumbRefA.current.getBoundingClientRect().left;

        document.addEventListener('mousemove', handleMouseMoveA);
        document.addEventListener('mouseup', handleMouseUpA);
    };

    const sliderRef = React.useRef();
    const thumbRef = React.useRef();

    // console.log(sliderRef, thumbRef)

    const diff = React.useRef();

    const handleMouseMove = (event) => {
        let newX =
            event.clientX -
            diff.current -
            sliderRef.current.getBoundingClientRect().left;

        const end =
            sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;


        const start = 0;

        if (newX < start) {
            newX = 0;
        }
        if (newX > end) {
            newX = end;
        }

        const newPercentage = getPercentage(newX, end);
        const newValue = getValue(newPercentage, max);

        thumbRef.current.style.left = getLeft(newPercentage);
        onChange(newValue);

        if (newValue > 0 || newValue < 10) {
            setAddYear(Number(newValue.toFixed(0)))
            setCountStop(true)
            // console.log(newValue.toFixed(0))
        } else {
            setAddYear(0)
        }

    };
    const handleMouseUp = () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
    };

    const handleMouseDown = event => {
        diff.current =
            event.clientX - thumbRef.current.getBoundingClientRect().left;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };


    const controledTable = (
        <>
            <tr style={{ background: "#5E7594" }}>
                <td data-title="場址類別" className="">
                    農地場址
                </td>
                <td data-title="面積占比" className="">
                    {controlPercent[0]}
                </td>
            </tr>
            <tr style={{ background: "#5E7594" }}>
                <td data-title="場址類別" className="">
                    事業場址
                </td>
                <td data-title="面積占比" className="">
                    {enterprisePercent}
                </td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">
                    工廠
                </td>
                <td data-title="面積占比" className="">
                    {controlPercent[3]}
                </td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">
                    儲槽
                </td>
                <td data-title="面積占比" className="">
                    {controlPercent[2]}
                </td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">
                    其他
                </td>
                <td data-title="面積占比" className="">
                    {controlPercent[6]}
                </td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">
                    加油站
                </td>
                <td data-title="面積占比" className="">
                    {controlPercent[1]}
                </td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">
                    非法棄置場址
                </td>
                <td data-title="面積占比" className="">
                    {controlPercent[4]}
                </td>
            </tr>
            <tr style={{ background: "#00005B" }}>
                <td data-title="場址類別" className="">
                    軍事場址
                </td>
                <td data-title="面積占比" className="">
                    {controlPercent[5]}
                </td>
            </tr>
        </>
    );

    return (
        <div className="countyData-container container">
            <div className="d-flex row">
                <div className="left-side col-sm-12 col-md-12 col-lg-6">
                    <div className="d-flex">
                        <div className="dropdown">
                            <div className="circle-with-data">
                                <div className="text-container">
                                    <a href={`${SSL}//${domain}/SGM/Authorized/ReturnBackSso.aspx?retTail=Site_Report_Index.asp`} title="回系統查詢">
                                        <h6 className="circle-inner-text">列管中</h6>
                                        <h6 className="circle-inner-text">場址面積</h6>
                                        <h6 className="circle-inner-text number">
                                            {(totalControlSite / 10000).toFixed(2)}
                                        </h6>
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
                                <tbody className="site-table-body">{controledTable}</tbody>
                            </table>
                        </div>
                        <div className="dropdown">
                            <div className="circle-with-data">
                                <div className="text-container">
                                    <div>
                                        <h6 className="circle-inner-text">累計</h6>
                                        <h6 className="circle-inner-text">改善解列進度</h6>
                                        <h6 className="circle-inner-text number">{freePercent}</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="tooltip-total-container" id="tooltip-total-container">
                                <div className="bar-with-circle"></div>
                                <h5 className="tooltip-total-title">累積改善解列場址</h5>
                                <div className="align-container">
                                    <a href={`${SSL}//${domain}/SGM/Authorized/ReturnBackSso.aspx?retTail=Site_Report_Index.asp`} target="_blank" title="回系統查詢">
                                        <h4>{totalFreeSite}</h4>
                                    </a>
                                    <h6 className="tooltip-total-subtitle">處</h6>
                                </div>
                                <h5 className="tooltip-total-title">場址類別</h5>
                                <div className="release-container">
                                    <div className="release-single-container">
                                        <h6 className="tooltip-total-subtitle">農地</h6>
                                        <div className="align-container">
                                            <h4>{siteFree[0]}</h4>
                                            <h6 className="tooltip-total-subtitle">處</h6>
                                        </div>
                                    </div>
                                    <LittlePieChart
                                        siteFree={siteFree}
                                        totalFreeSite={totalFreeSite}
                                    />
                                    <div className="release-single-container">
                                        <h6 className="tooltip-total-subtitle">事業</h6>
                                        <div className="align-container">
                                            <h4>{totalFreeSite - siteFree[0]}</h4>
                                            <h6 className="tooltip-total-subtitle">處</h6>
                                        </div>
                                    </div>
                                </div>
                                <h5 className="tooltip-total-title">解除列管狀態</h5>
                                <div className="release-container">
                                    <div className="release-single-container">
                                        <h6 className="tooltip-total-subtitle">七條五(含細八)</h6>
                                        <div className="align-container">
                                            <h4>{totalData(freeLimitCope)}</h4>
                                            <h6 className="tooltip-total-subtitle">處</h6>
                                        </div>
                                    </div>
                                    <div className="release-single-container">
                                        <h6 className="tooltip-total-subtitle">控制場址</h6>
                                        <div className="align-container">
                                            <h4>{totalData(controlFree)}</h4>
                                            <h6 className="tooltip-total-subtitle">處</h6>
                                        </div>
                                    </div>
                                    <div className="release-single-container">
                                        <h6 className="tooltip-total-subtitle">整治場址</h6>
                                        <div className="align-container">
                                            <h4>{totalData(remFree)}</h4>
                                            <h6 className="tooltip-total-subtitle">處</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="donut-container">
                    </div> */}
                    <div className="donutChart">
                        <ReactApexChart
                            options={options}
                            series={options.series}
                            type="donut"
                            width={320}
                            className="donut-chart"
                        />
                        <div className="innerText">
                            <div className="number-container">
                                {hoverdLabel}&nbsp;
                                <div className="sunburstValue">
                                    {totalData(accumulateBulletin)}
                                </div>
                                處
                            </div>
                        </div>
                    </div>
                    <hr className="dash-line1" />
                    <hr className="dash-line2" />
                    {showPie && (
                        <PieChart
                            clickDetail={clickDetail}
                            setClickDetail={setClickDetail}
                            enterpriseSite={enterpriseSite}
                            enterprise={enterprise}
                            farmSite={farmSite}
                            enterpriseTotal={enterpriseTotal}
                        />
                    )}
                </div>
                <div className="right-side col-sm-12 col-md-12 col-lg-6">
                    <h3>各縣市列管事業場址數</h3>
                    <h5>統計數據包含全臺各縣市各年度區間列管之事業場址數，</h5>
                    <h5>
                        其中未納入地下水限制使用地區場址數，
                        <span className="number-w5">{beginYear + addYear}年</span>全台共有
                        <span className="number-w5 with-underline">
                            {enterpriseByYearLength > 0 ? enterpriseByYearLength : 0}
                        </span>
                        處事業場址數
                    </h5>
                    <div className="timerBar-and-text">
                        <h3 className="number-w5">{beginYear + addYear}年</h3>
                        <div className="progressBarA" id="map-timeBar" ref={sliderRefA} >
                            <div className="anchorA" id="anchorA"
                                style={{ left: getLeft(initialPercentage) }}
                                ref={thumbRefA}
                                onMouseDown={handleMouseDownA}
                            >

                            </div>
                        </div>

                        <div className="progress-btn" onClick={() => stopCounter()}>
                            <i className="fas fa-pause" onClick={() => stopCounter()}></i>
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
                    <div
                        className="progressBar" id="barChart-timeBar" ref={sliderRef}>
                        <div className="anchor" id="anchor" ref={thumbRef} style={{ left: getLeft(initialPercentage) }} onMouseDown={handleMouseDown}>

                        </div>
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
                        <div
                            className="label-circle"
                            style={{ background: "#A9D18E" }}
                        ></div>
                        <p>公告為控制場址</p>
                    </div>
                    <div onClick={() => setType(2)} className="label-container">
                        <div
                            className="label-circle"
                            style={{ background: "#70AD47" }}
                        ></div>
                        <p>公告解除控制場址</p>
                    </div>
                    <div onClick={() => setType(3)} className="label-container">
                        <div
                            className="label-circle"
                            style={{ background: "#19F3C4" }}
                        ></div>
                        <p>公告為整治場址</p>
                    </div>
                    <div onClick={() => setType(4)} className="label-container">
                        <div
                            className="label-circle"
                            style={{ background: "#08A07F" }}
                        ></div>
                        <p>公告解除整治場址</p>
                    </div>
                </div>
                <BarChart key={type}
                    type={type}
                    setType={setType}
                    fetchData={fetchData}
                    addYear={addYear}
                    barData={barData}
                    setBarData={setBarData} />
                <div className="barChart-note">
                    <div>
                        <p className="note-label note-1">
                            <i class="fas fa-tint"></i>
                            &nbsp;點選縣市長條圖，可瞭解各場址類別場址數
                        </p>
                    </div>
                    <div>
                        <p className="note-label note-2">{Today}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(CountyData);
