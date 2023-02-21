import React from 'react';
import { BrowserRouter as HashRouter, Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory as createHistory } from "history";
import './App.css';
import HashLoader from "react-spinners/HashLoader";
import { CookiesProvider, useCookies } from 'react-cookie';


const CountyData = React.lazy(() => import('./CountyData'));
const Site = React.lazy(() => import('./Site'));
const Groundwater = React.lazy(() => import('./Groundwater'));


function App() {
  //為了區分原本網站和react頁面url, react頁面的url前面一律加/react(可以改basename)
  //url = https://網站domain/$basename/$path
  //例如: countyData頁面的 url = https://網站domain/react/countyData
  const history = createHistory({
    basename: "/ITP"
  })

  //loading的動畫的位置樣式
  const override = `
 display: block;
 top:40%;
 left:calc(50% - 30px);
 position:absolute;
`;

  return (
    <>
      {/* HashLoader - loading的動畫 ,可以換樣式-https://www.davidhu.io/react-spinners/*/}
      <React.Suspense fallback={
        <HashLoader
          css={override}
          size={80}
          color={"#5cc777"}
          loading={false}
        />
      }>
        <Router history={history} basename="/ITP">
          <CookiesProvider>
            <Switch>
              {/* path="/countyData"的時候, 渲染CountyData這個Component */}
              <Route path="/countyData">
                <CountyData />
              </Route>
              <Route path="/site">
                <Site />
              </Route>
              <Route path="/groundwater">
                <Groundwater />
              </Route>
              {/* <Route path="/test">
              <Test />
            </Route> */}
            </Switch>
          </CookiesProvider>
        </Router>
      </React.Suspense>
    </>
  );
}

export default App;
