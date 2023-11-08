import React from 'react';
import {
    AppBar, Toolbar, Typography,
} from '@mui/material';
import './TopBar.css';
import axios from 'axios';

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app_version: undefined,
        };
    }

    componentDidMount() {
        this.handleAppVersionChange();
    }

    handleAppVersionChange() {
        const app_version = this.state.app_version;
        if (app_version === undefined) {
            axios.get('/test/info')
                .then((response) => {
                    this.setState({
                        app_version: response.data,
                    });
                });
        }
    }

    render() {
        const { app_version } = this.state;
        return app_version ? (
            <AppBar className="topbar-appBar" position="absolute">
                <Toolbar className="topbar">
                    <Typography variant="h5" color="inherit">
                        Bastions
                    </Typography>
                    <div style={{ flex: 1 }} />
                    <Typography
                        variant="h5"
                        component="div"
                        color="inherit"
                        style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}
                    >
                        {this.props.page_content}
                    </Typography>
                    <Typography variant="h5" color="inherit">
                        Version: {this.state.app_version.version}
                    </Typography>
                </Toolbar>
            </AppBar>
        ) : (
            <div />
        );
    }
}

export default TopBar;
