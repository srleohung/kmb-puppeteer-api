const puppeteer = require('puppeteer');

class KMB {
    constructor() {
        this.browser = undefined;
        this.route = {};
        (async () => {
            this.browser = await puppeteer.launch({
                headless: true
            });
        })()
        this.selector = {
            closeButton: '#mapDiv_root > div.esriPopup.esriPopupVisible > div.esriPopupWrapper > div.sizer.content > div > table > tbody > tr:nth-child(1) > td:nth-child(2)',
            stationButton: (station) => { return '#busStopTable > tbody > tr:nth-child(' + station + ') > td.stopTd.imgHover > div > span' },
            arrivalTime: '#mapDiv_root > div.esriPopup.esriPopupVisible > div.esriPopupWrapper > div.sizer.content > div > table > tbody > tr:nth-child(5) > td > table > tbody > tr:nth-child(2) > td',
            imgRouteSearchIcon: '#imgRouteSearchIcon',
            txtRoute: '#txtRoute',
            routeSearchButton: '#routeSearchButton',
        }
    }

    async searchBusRouteNumber(number) {
        this.route[number] = await this.browser.newPage();
        this.route[number].emulate({
            viewport: {
                width: 1920,
                height: 1080
            },
            userAgent: ''
        });
        await this.route[number].goto('https://search.kmb.hk/KMBWebSite/index.aspx?lang=tc');
        await this.route[number].click(this.selector.imgRouteSearchIcon);
        await this.route[number].type(this.selector.txtRoute, number)
        await new Promise(r => setTimeout(r, 500));
        await this.route[number].click(this.selector.routeSearchButton);
        await this.route[number].waitForTimeout(2500);
    }

    async searchBusRouteStation(number, station) {
        if (!this.route[number]) {
            await this.searchBusRouteNumber(number)
        }
        if (await this.route[number].$(this.selector.closeButton) !== null) {
            await this.route[number].click(this.selector.closeButton)
        }
        await this.route[number].click(this.selector.stationButton(station));
        await this.route[number].waitForSelector(this.selector.arrivalTime)
        return await this.route[number].evaluate(el => el.textContent, await this.route[number].$(this.selector.arrivalTime))
    }
}

var express = require('express');
app = express();
port = process.env.PORT || 3000;

app.listen(port);

const kmb = new KMB()

const searchBusRouteStation = async (req, res) => {
    res.status(200).send({ value: await kmb.searchBusRouteStation(req.query.number, req.query.station) })
}

app.route('/searchBusRouteStation').get(searchBusRouteStation)