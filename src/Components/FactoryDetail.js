import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { formatDate } from '../utils/Functions';

function FactoryDetail(props) {
  const showListData = props.showListData;
  const factoryName = props.factoryName;
  const setShowDetail = props.setShowDetail;
  const showDetailData = props.showDetailData;
  const RemediationDate = props.RemediationDate;
  const pollution = props.pollution;
  const SSL = props.SSL;
  const domain = props.domain;

  // console.log("iii", RemediationDate);

  let history = useHistory()

  const backHistory = () => {
    history.push('/countyData')
  }

  const Pollutiob_Soil = pollution.map(data => data.Pollutiob_Soil)
  let str_split = String(Pollutiob_Soil).split(";");
  let str_final = "";
  let str_final2 = "";
  str_split.forEach(function (o) {
    let o_split = o.split(":");
    str_final = str_final + o_split[0] + "\n";
    str_final2 = str_final2 + o_split[1] + "\n";
  });
  // console.log(Pollutiob_Soil);
  // console.log(str_final);
  // console.log(str_final2)

  const Pollutiob_Gw = pollution.map(data => data.Pollutiob_Gw)
  let gw_str_split = String(Pollutiob_Gw).split(";");
  let gw_str_final = "";
  let gw_str_final2 = "";
  gw_str_split.forEach(function (o) {
    let gw_o_split = o.split(":");
    gw_str_final = str_final + gw_o_split[0] + "\n";
    gw_str_final2 = str_final2 + gw_o_split[1] + "\n";
  });
  // console.log(Pollutiob_Gw);
  // console.log(gw_str_final);
  // console.log("gw_str_final2", gw_str_final2)


  return (
    <div className="detail-list">
      <div className="close-btn-control">
        <div
          className="close-btn"
          onClick={() => {
            setShowDetail(false);
          }}
        >
          x
        </div>
      </div>
      <div className="factory-name">{factoryName}<a href={`${SSL}//${domain}/SGM/Authorized/ReturnBackSso.aspx?retTail=Site_index_Common_View.asp?Site_No=${showDetailData.siteNo}`} target="_blank" className="site-no" title={showDetailData.siteNo} >[{showDetailData.siteNo}]</a></div>
      <div className="detail-list-content">
        <table>
          <thead>
            <tr className="detail-th">
              <th>????????????(????????????)</th>
              <th>????????????</th>
              <th>????????????</th>
              <th>????????????(%)</th>
              <th>????????????</th>
            </tr>
          </thead>
          <tbody>
            <tr className="detail-td">
              <td>{showDetailData.siteArea ? showDetailData.siteArea : "?????????"}</td>
              <td>{showDetailData.siteKind ? showDetailData.siteKind : "?????????"}</td>
              <td>{showDetailData.situation ? showDetailData.situation : "?????????"}</td>
              <td>{showDetailData.progress ? showDetailData.progress : "?????????"}</td>
              <td>{showDetailData.stage ? showDetailData.stage : "?????????"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="pollutants">
        <div className="pollutants-title">???????????????</div>
        {/* <div className="pollutants-list">
          {pollution.map(data =>
            <div>{data.Pollutiob_Soil ? data.Pollutiob_Soil.replace(/;/g, '\n') : "???"}</div>
          )}
        </div> */}
        <div className="pollutants-list">
          <div className="list-left">{str_final}</div>
          <div className="list-right">{str_final2 !== "undefined\nundefined\n" ? str_final2.split("undefined\n") : ""}</div>
        </div>
      </div>
      <div className="remediationDate">
        <div className="remediationDate-title">??????????????????</div>
        <div className="remediationDate-list">
          <div className="list-date-title">??????<span>/</span>??????</div>
          <table>
            <tbody>
              {RemediationDate.map((data, index) =>
                <>
                  <tr className="detail-td">
                    <td>{formatDate(data.Date)}</td>
                    <td className="td-text">{data.Description}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ground-water">
        <div className="ground-water-title">??????????????????</div>
        <div className="ground-water-content">
          {/* {pollution.map(data =>
            <p>{data.Pollutiob_Gw ? data.Pollutiob_Gw.replace(/;/g, '\n') : data.Pollutiob_Soil ? data.Pollutiob_Soil.replace(/;/g, '\n') : "???"}</p>
          )} */}
          <div className="list-left">{gw_str_final ? gw_str_final : str_final}</div>
          <div className="list-right">{gw_str_final2 != "undefined\nundefined\n" ? gw_str_final2.split("undefined\n") : ""}</div>
        </div>
      </div>
    </div>
  );
}

export default FactoryDetail;
