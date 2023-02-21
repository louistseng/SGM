import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import './Site.scss';
import { formatDate } from './utils/Functions';
import FocusList from './Components/FocusList';
import FactoryDetail from './Components/FactoryDetail';
// import cityData from './CityData.json';
import cityData from './data.json';

function Site() {

    const [fetchData, setFetchData] = useState([]);
    const [showListData, setShowListData] = useState([]);
    const [showDetailData, setShowDetailData] = useState()
    const [areaName, setAreaName] = useState();
    const [factoryName, setFactoryName] = useState("")
    const [showList, setShowList] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [remediation, setRemediation] = useState([])
    const [pollution, setPollution] = useState([])

    // console.log(pollution.map(data => data.Pollutiob_Soil))

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
    }
    // const domain = "https://sgw.eri.com.tw";
    let SSL = window.location.protocol;
    let domain = window.location.hostname;

    useEffect(() => {
        document.title = '互動式議題平臺－輿情關注場址治理資訊';

        axios.post(`${SSL}//${domain}/ITPWeb/api/SiteInfo`, headers
        ).then(res => {
            // console.log(JSON.parse(res.data))
            setFetchData(JSON.parse(res.data))
        })
            .catch(err => {
                console.log(err)
            })
    }, [])

    // 重大日期篩選
    const RemediationDate = remediation.filter((item) => {
        const name = item.Code_Name;
        const date = formatDate(item.Date);
        if (item.Site_No === showDetailData.siteNo && date !== "1970/01/01") {
            if (name === 'B1' || name === 'B3' || name === '999-1-02' || name === '999-1-03' || name === '123-1-05' || name === '123-4-07' || name === '123-2-19' || name === '123-2-26' || name === 'G2:122-4-04' || name === 'G2:122-4-05' || name === 'G2:122-4-06' || name === 'G5:123-5-05' || name === 'G5:123-5-06' || name === 'G5:123-5-08' || name === 'G5:123-5-09' || name === '122-3-14' || name === '123-2-11' || name === '123-2-28' || name === '123-2-35' || name === '123-2-42' || name === '123-2-45')
                return item;
        }
    })

    // console.log("RemediationDate", RemediationDate)

    //泡泡球數量
    const map = {};
    const result = fetchData.filter((item) => {
        if (map[item.areaName] === undefined) {
            map[item.areaName] = 1;
            return true
        } else {
            map[item.areaName]++

            return false
        }
    });
    const quantityData = result.map((item, index) => {
        item.quantity = map[item.areaName]
        return item
    })
    const show = (data) => {
        const areaNameData = fetchData.filter((item) => {
            if (item.areaName === data.areaName) {
                return item;
            }
        });
        // ------------------------------------------------------------------
        // const map = {};
        // const result = cityData.filter((item) => {
        //     if (map[item.new_areaname] === undefined) {
        //         map[item.name] = 1;
        //         return true
        //     } else {
        //         map[item.new_areaname]++

        //         return false
        //     }
        // });
        // const quantityData = result.map((item, index) => {
        //     item.quantity = map[item.new_areaname]
        //     return item
        // })
        // console.log('quantityData', quantityData)

        // const show = (data) => {
        //     const areaNameData = fetchData.filter((item) => {
        //         if (item.new_areaname === data.new_areaname) {
        //             return item;
        //         }
        //     });

        setAreaName(data.areaName)
        setShowListData(areaNameData)
        setShowList(true)
        // console.log("areaNameData", areaNameData)
    }

    // const city = cityData.sort((a, b) => {
    //     if (a.value < b.value) {
    //         return 1;
    //     }
    //     if (a.value > b.value) {
    //         return -1;
    //     }
    //     return 0;
    // })

    return (
        <>
            <div className="site-container container">
                {/* 第三層 */}
                {showDetail &&
                    <FactoryDetail
                        showListData={showListData}
                        setShowDetail={setShowDetail}
                        factoryName={factoryName}
                        showDetailData={showDetailData}
                        RemediationDate={RemediationDate}
                        pollution={pollution}
                        SSL={SSL}
                        domain={domain}
                    />}
                {/* 左 */}
                <div className="left-side">
                    <label>總關注場址（處）</label>
                    <div className="count-number">{fetchData.length}</div>
                    <div className="left-bottom-side" style={{ backgroundImage: "url(images/bubble.svg)" }}>
                        <label>各縣市關注場址（處）</label>
                        <div><label className="click-label">點選各縣市展開場址清單</label></div>
                        {/* {city.map((data, index) => */}
                        {quantityData.sort((a, b) => {
                            if (a.quantity < b.quantity) {
                                return 1;
                            }
                            if (a.quantity > b.quantity) {
                                return -1;
                            }
                            return 0;
                        }).map((data, index) =>
                            <div key={index}
                                className={`bubble bubble${index + 1}`}
                                onClick={() => { show(data) }}
                                style={{
                                    padding: data.quantity <= 1 ? `calc(2% *${data.quantity} + 0.1vw)` : data.quantity <= 8 ? `calc(1%*${data.quantity} + 0.6vw)` : "calc(10% + 0.6vw)",
                                    fontSize: data.quantity <= 1 && `5px`
                                }}>
                                <div className={data.quantity > 1 ? "bubble-content" : "bubble-content-sec"}>
                                    <p>{data.areaName}</p>
                                    {/* <p>{data.name}</p> */}
                                    {data.quantity > 1 && <p> {data.quantity}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 右 */}
                <div className="right-side">
                    {/* 第二層 */}
                    <iframe src={`${SSL}//${domain}/ITPWeb/Page/Site/Index.aspx`} title="列管狀態" frameBorder="0" ></iframe>
                    {showList &&
                        <FocusList key={showListData.index}
                            showListData={showListData}
                            areaName={areaName}
                            setShowList={setShowList}
                            setShowDetail={setShowDetail}
                            setFactoryName={setFactoryName}
                            setShowDetailData={setShowDetailData}
                            setRemediation={setRemediation}
                            setPollution={setPollution}
                            SSL={SSL}
                            domain={domain}
                            headers={headers}
                        />
                    }
                </div>
            </div>
        </>
    )
}
export default withRouter(Site);

