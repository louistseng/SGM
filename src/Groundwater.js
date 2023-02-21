import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import './gw.scss';

function Groundwater() {

    let SSL = window.location.protocol;
    let domain = window.location.hostname;

    useEffect(() => {
        document.title = '互動式議題平臺－地下水污染趨勢預警';
    }, [])

    return (
        <>
            <div className="gw-container container">
                <div className="left-side">
                    <div className="gw-warning">
                        <div>地下水污染</div>
                        <div> 趨勢預警</div>

                        <img src="images/gw-logo.png" className="gw-logo" alt="gw-logo" title="gw-logo" />
                    </div>
                </div>
                <div className="right-side">
                    <iframe src={`${SSL}//${domain}/ITPWeb/Page/Gw/Index.aspx`} title="地下水污染趨勢預警" frameBorder="0" ></iframe>
                </div>
            </div>
        </>
    )
}

export default withRouter(Groundwater);


