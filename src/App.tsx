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
            <Route exact path="/countries" component={Countries}/>
        </Switch>
        <NotificationContainer/>
    </div>;
}

export default App;
