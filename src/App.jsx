import React from 'react';
import logo from './assets/snooze_logo.png';
import './App.css';
import superagent from 'superagent';
import {CSSTransition} from 'react-transition-group';
import ReminderModule from './reminder_module.jsx';

class SnoozeApp extends React.Component {
    state = {
        pageViews: undefined,
    };
    componentDidMount() {
        superagent
            .get('https://afvvxda1wl.execute-api.us-west-1.amazonaws.com/beta/pageViews')
            .send() // sends a JSON post body
            .set('X-API-Key', '1OYL0FAalZ1PtBXJKG0u03iwQQlwXBK57Hj4TFEp')
            .set('accept', 'json')
            .then((res) => {
                const pageViews = res.body.Items[0].pageViewCount;
                this.setState({pageViews: pageViews});
                superagent
                    .post('https://afvvxda1wl.execute-api.us-west-1.amazonaws.com/beta/pageViews')
                    .send({pageViewCount: 1}) // sends a JSON post body
                    .set('X-API-Key', '1OYL0FAalZ1PtBXJKG0u03iwQQlwXBK57Hj4TFEp')
                    .set('accept', 'json')
                    .then((res) => {
                        // console.log('POST request successful');
                    })
                    .catch((err) => {
                        console.log('Encountered an error: ', err);
                    });
            })
            .catch((err) => {
                console.log('Encountered an error: ', err);
            });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="header">
                        <CSSTransition appear in classNames="item" timeout={500}>
                            <img src={logo} className="App-logo" alt="logo" />
                        </CSSTransition>
                        <span className="App-Title">snooZe</span>
                    </div>
                </header>
                <ReminderModule />
                <div className={this.state.pageViews ? 'pageCount' : 'pageCountHidden'}>
                    <CSSTransition appear in classNames="item" timeout={500}>
                        <span>{this.state.pageViews}</span>
                    </CSSTransition>
                    <span className="pageHitsText">page hits</span>
                </div>
            </div>
        );
    }
}

export default SnoozeApp;
