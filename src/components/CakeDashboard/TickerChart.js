import React, { Component, Fragment } from 'react';
import { Row } from 'react-bootstrap';
import Script from 'react-load-script';
import * as R from 'ramda';

import './EstimatedCakeEarnings.css';

export default class TickerChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skipScriptLoad: !!window.TradingView,
    };
  }

  componentDidMount() {
    if (this.state.skipScriptLoad) {
      this.drawWidget();
    }
  }

  drawWidget() {
    new window.TradingView.widget(
      R.merge(
        {
          autosize: true,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'Light',
          style: '3',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_c0310',
        },
        this.props.stockTicker ? { symbol: this.props.stockTicker } : {}
      )
    );
  }

  handleScriptLoad() {
    this.drawWidget();
  }

  render() {
    return (
      <Fragment>
        {this.state.skipScriptLoad ? null : (
          <Script url="https://s3.tradingview.com/tv.js" onLoad={this.handleScriptLoad.bind(this)} />
        )}
        <Row className="tradingview-widget-container">
          {!this.props.stockTicker ? (
            <p>
              <small>Enter your company ticker to see stock price details:</small>
            </p>
          ) : null}
          <div id="tradingview_c0310" style={{ height: '700px' }} />
        </Row>
      </Fragment>
    );
  }
}
