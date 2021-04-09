# kmb-puppeteer-api

# How to use?
- Start the API server
```bash
node index.js 
```
- Get the arrival time of KMB
```bash
http://localhost:3000/searchBusRouteStation?number=$number&station=$station
```

# Example
- 獲得 24 往 旺角(循環線) 洗衣街水務署 的到站時間
```bash
http://localhost:3000/searchBusRouteStation?number=24&station=16
```