import React, { useEffect, useState } from 'react'
import '../Site.scss';
import axios from 'axios';

function FocusList(props) {

    const areaName = props.areaName;
    const setFactoryName = props.setFactoryName;
    const showListData = props.showListData;
    const setShowList = props.setShowList;
    const setShowDetail = props.setShowDetail;
    const setShowDetailData = props.setShowDetailData;
    const setRemediation = props.setRemediation;
    const setPollution = props.setPollution;

    // console.log("showListData", showListData)

    const SSL = props.SSL;
    const domain = props.domain;
    const headers = props.headers;

    const show = (data) => {
        setShowDetail(true)
        setFactoryName(data.siteName)
        // console.log("data", data)
        setShowDetailData(data)

        axios.post(`${SSL}//${domain}/ITPWeb/api/SiteFlowDate`, headers
        ).then(res => {
            setRemediation(JSON.parse(res.data))
            // console.log("SiteFlowDate", JSON.parse(res.data))
        })
            .catch(err => {
                console.log(err)
            })

        const siteNo = JSON.stringify(data.siteNo);

        const config = {
            method: 'post',
            url: `${domain}/ITPWeb/api/SitePollutionBySiteNo`,
            headers: headers,
            data: siteNo
        };

        axios(config)
            .then(res => {
                setPollution(JSON.parse(res.data))
                // console.log("F", JSON.parse(res.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div>
            <div className={`focus-container focus-container${showListData.index}`}>
                <div className="close-btn"
                    onClick={() => {
                        setShowList(false)
                        setShowDetail(false)
                    }}>x</div>
                <div className="d-flex ml-2 mt-1">
                    <h2 className="focus-list-title">{areaName}關注場址清單</h2>
                    <div className="ml-4 mt-1 color-desc">
                        <p>黃底色為整治場址</p>
                        <p>無底色為控制場址</p>
                    </div>
                </div>
                {showListData.sort((a, b) => {
                    if (a.situation === "公告為整治場址") {
                        return -1;
                    }
                    if (a.situation === "公告為整治場址") {
                        return 1;
                    }
                    return 0;
                }).map((data, index) =>
                    <div className="list-box" key={index} onClick={() => { show(data) }} >
                        <div className={data.situation === "公告為整治場址" ? "list-card card" : "list-card"}>
                            <p >{data.siteName}</p>
                            <p className="card-site">[{data.siteNo}]</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default FocusList;

