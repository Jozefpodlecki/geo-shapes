import { FunctionComponent, useState } from 'react';
import CountryPage from './components/CountryPage';
import Toolbar from './components/Toolbar';
import { Route } from 'react-router-dom';
import SearchGeoObjectsDialog from './components/SearchGeoObjectsDialog';
import './App.scss';
import { World } from './svgs';

const App: FunctionComponent = () => {
    const [isShowing, setShow] = useState(false);
    
    const onSearch = () => setShow(true);
    const onHide = () => setShow(false);

    return <div className="app">
        <Toolbar onSearch={onSearch} />
        <div className="world">
            <World className="worldsvg"/>
        </div>
        <SearchGeoObjectsDialog
            onHide={onHide}
            isShowing={isShowing}/>
        <Route path="/draw">
            <CountryPage/>
        </Route>
        <Route path="/country/:code">
            <CountryPage/>
        </Route>
    </div>;
}

export default App;
