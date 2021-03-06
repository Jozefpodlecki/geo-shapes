import { FunctionComponent, useState } from 'react';
import CountryPage from 'components/CountryPage';
import Countries from 'components/Countries';
import Toolbar from 'components/Toolbar';
import { Route, Switch } from 'react-router-dom';
import SearchGeoObjectsDialog from 'components/SearchGeoObjectsDialog';
import DrawPage from 'components/DrawPage';
import ExplorePage from 'components/ExplorePage';
import { NotificationContainer } from 'react-notifications';

import './app.scss';
import WorldPage from 'components/WorldPage';
import Home from 'components/Home';
import InspectGeojson from 'components/InspectGeojson';
import Capitals from 'components/Capitals';
import BOTs from 'components/BOTs';
import BOT from 'components/BOT';

const App: FunctionComponent = () => {
    const [isShowing, setShow] = useState(false);
    const onSearch = () => setShow(true);
    const onHide = () => setShow(false);

    return <div className="app">
        <Toolbar onSearch={onSearch} />
        <SearchGeoObjectsDialog
            onHide={onHide}
            onClick={onHide}
            isShowing={isShowing}/>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/explore" component={ExplorePage}/>
            <Route exact path="/draw" component={DrawPage}/>
            <Route exact path="/country/:iso3166a2" component={CountryPage}/>
            <Route exact path="/country/:iso3166a2/neighbours" component={CountryPage}/>
            <Route exact path="/bots" component={BOTs}/>
            <Route exact path="/bot/:name" component={BOT}/>
            <Route exact path="/countries" component={Countries}/>
            <Route exact path="/capitals" component={Capitals}/>
            <Route exact path="/inspect-geojson" component={InspectGeojson}/>
        </Switch>
        <NotificationContainer/>
    </div>;
}

export default App;
