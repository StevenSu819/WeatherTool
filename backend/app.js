'use strict';

const express = require('express');
const router = require('express').Router();
const got = require('got');
const cors = require('cors');
const { pipeline } = require('stream');
const app = express();
app.use(cors());
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

var chOneList =[];
var hourwhole ={};
const wCReference = {
    '4201': 
    {
        'description': "Heavy Rain",
        'icon': "rain_heavy"      
    },
    '4001':
    {
        'description': "Rain",
        'icon': "rain"
    },
    '4200':
    {
        'description': "Light Rain",
        'icon': "rain_light"
    },
    '6201':
    {
        'description': "Heavy Freezing Rain",
        'icon': "freezing_rain_heavy"
    },
    '6001':
    {
        'description': "Freezing Rain",
        'icon': "freezing_rain"
    },
    '6200':
    {
        'description': "Light Freezing Rain",
        'icon': "freezing_rain_light"
    },
    '6000':
    {
        'description': "Freezing Drizzle",
        'icon': "freezing_drizzle"
    },
    '4000':
    {
        'description': "Drizzle",
        'icon': "drizzle"
    },
    '7101':
    {
        'description': "Heavy Ice Pellets",
        'icon': "ice_pellets_heavy"
    },
    '7000':
    {
        'description': "Ice Pellets",
        'icon': "ice_pellets"
    },
    '7102':
    {
        'description': "Light Ice Pellets",
        'icon': "ice_pellets_light"
    },
    '5101':
    {
        'description': "Heavy Snow",
        'icon': "snow_heavy"
    },
    '5000':
    {
        'description': "Snow",
        'icon': "snow"
    },
    '5100':
    {
        'description': "Light Snow",
        'icon': "snow_light"
    },
    '5001':
    {
        'description': "Flurries",
        'icon': "flurries"
    },
    '8000':
    {
        'description': "Thunderstorm",
        'icon': "tstorm"
    },
    '2100':
    {
        'description': "Light Fog",
        'icon': "fog_light"
    },
    '2000':
    {
        'description': "Fog",
        'icon': "fog"
    },
    '1001':
    {
        'description': "Cloudy",
        'icon': "cloudy"
    },
    '1102':
    {
        'description': "Mostly Cloudy",
        'icon': "mostly_cloudy"
    },
    '1101':
    {
        'description': "Partly Cloudy",
        'icon': "partly_cloudy_day",
        'night_icon': "partly_cloudy_night"
    },
    '1100':
    {
        'description': "Mostly Clear",
        'icon': "mostly_clear_day",
        'night_icon': "mostly_clear_night"
    },
    '1000':
    {
        'description': "Clear",
        'icon': "clear_day",
    
    },
    '3000':
    {
        'description': "Light Wind",
        'icon': "light_wind"
    },
    '3001':
    {
        'description': "Wind",
        'icon': "wind"
    },
    '3002':
    {
        'description': "Strong Wind",
        'icon': "strong_wind"
    }
  };
app.get('/api/citylist',function(req,res){
  const inputText = req.query.text;
    (async () => {
      try {
        const response = await got('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+ inputText + '&components=country:us&types=(cities)&key=AIzaSyBQS3aGQMFJMRtBI5PVjogIWIzQCC6hsko');
        let body = JSON.parse(response.body);
        let prediction = body.predictions;
        let city = [];
        for(let i = 0, len = prediction.length; i < len; i++){
          let term = prediction[i].terms;
          if(term.length > 1){
            let pair = {};
            pair['city'] = term[0].value;
            pair['state'] =  term[1].value;
            city.push(pair);
          }
        }
        console.log(city);
        let datai = {};
        datai['data'] = city;
        res.json(datai);
        //=> '<!doctype html> ...'
      } catch (error) {
        console.log(error.response.body);
        //=> 'Internal server error ...'
      }
  })();
//   const dataStream = got.stream({
//     uri: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
//     qs: {
//       input: inputText,
//       components: 'country:us',
//       types: '(cities)',
//       key: 'AIzaSyBQS3aGQMFJMRtBI5PVjogIWIzQCC6hsko'
//     }
//   });
//   pipeline(dataStream, res, (err) => {
//       if(err) {
//           res.sendStatus(500);
//       }
//   });
//   res.send(dataStream);
});

app.get('/api/hour',function(req,res){
    hourwhole ={};
    const loc = req.query.loc;
    let url = 'https://api.tomorrow.io/v4/timelines?location='+ loc + '&fields=';
    let tfield = ["temperature","temperatureApparent","temperatureMin","temperatureMax","humidity","windSpeed","windDirection","pressureSeaLevel","visibility","cloudCover","uvIndex","weatherCode","precipitationProbability","precipitationType"];
    for(let i = 0, len = tfield.length; i < len; i++){
        url = url + tfield[i] + ',';
    }
    url = url.substring(0,url.length-1);
    console.log(url);
    url = url + '&timesteps=' + '1h';
    url = url + '&units=imperial&timezone=America/Los_Angeles';
    url = url + '&apikey=' + 'SQt1c6WRv87CVfrjX2S8s8R3SQdNScN6';
    console.log(url);
    (async () => {
        try {
            const response = await got(url);
            let body = JSON.parse(response.body);
            if(!body.data.timelines[0].intervals){
                throw 'tolimit';
            }
            let weatherHourly = body.data.timelines[0].intervals;
            let hourList=[];
            for(let i = 0, len = weatherHourly.length; i < len; i++){
                let dici = {};
                let time = weatherHourly[i].startTime;
                time = time.substring(0,19) + 'Z';
                let tem = weatherHourly[i].values.temperature;
                let hum = weatherHourly[i].values.humidity;
                let psea = weatherHourly[i].values.pressureSeaLevel;
                let ws = weatherHourly[i].values.windSpeed;
                let wd = weatherHourly[i].values.windDirection;
                dici["time"] = time;
                dici["data"] = {};
                dici["data"]["instant"] = {};
                dici["data"]["instant"]["details"] = {};
                dici["data"]["instant"]["details"]["air_temperature"] = tem;
                dici["data"]["instant"]["details"]["relative_humidity"] = hum;
                dici["data"]["instant"]["details"]["air_pressure_at_sea_level"] = psea;
                dici["data"]["instant"]["details"]["wind_speed"] = ws;
                dici["data"]["instant"]["details"]["wind_from_direction"] = wd;
                dici["data"]["next_12_hours"] = {};
                dici["data"]["next_12_hours"]["summary"]={};
                dici["data"]["next_12_hours"]["summary"]["symbol_code"] = "partlycloudy_day";
                dici["data"]["next_1_hours"] = {};
                dici["data"]["next_1_hours"]["summary"]={};
                dici["data"]["next_1_hours"]["summary"]["symbol_code"] = "partlycloudy_day";
                dici["data"]["next_1_hours"]["details"]={};
                dici["data"]["next_1_hours"]["details"]["precipitation_amount"] = hum;
                hourList.push(dici);
            }
            hourwhole["properties"] = {};
            hourwhole["properties"]["timeseries"] = hourList;
            let hourres = {};
            hourres['hourly'] = hourwhole;
            hourres['status'] = 'OK'
            res.json(hourres);
        }catch (error) {
            let errm = {};
            errm['status'] = 'Bad';
            res.json(errm);
            console.log(error.response.body);
            //=> 'Internal server error ...'
          }
    })();
});

app.get('/api/current',function(req,res){
    chOneList = [];
    const loc = req.query.loc;
    let url = 'https://api.tomorrow.io/v4/timelines?location='+ loc + '&fields=';
    let tfield = ["temperature","temperatureApparent","temperatureMin","temperatureMax","humidity","windSpeed","windDirection","pressureSeaLevel","visibility","cloudCover","uvIndex","weatherCode","precipitationProbability","precipitationType"];
    for(let i = 0, len = tfield.length; i < len; i++){
        url = url + tfield[i] + ',';
    }
    url = url.substring(0,url.length-1);
    console.log(url);
    url = url + '&timesteps=' + 'current';
    url = url + '&units=imperial&timezone=America/Los_Angeles';
    url = url + '&apikey=' + 'SQt1c6WRv87CVfrjX2S8s8R3SQdNScN6';
    console.log(url);
    (async () => {
        try {
          const response = await got(url);
        //   console.log(response);
          let body = JSON.parse(response.body);
          if(!body.data.timelines[0].intervals){
            throw 'tolimit';
          }
          let dwea = body.data.timelines[0].intervals;
          console.log(dwea);
          let daily = [];
          for(let i = 0, len = dwea.length; i < len; i++){
              let pair = {};
              let dvalue = dwea[i].values;
              pair['max'] = dvalue.temperatureMax;
              pair['min'] = dvalue.temperatureMin;
              pair['ws'] = dvalue.windSpeed;
              pair['appt'] = dvalue.temperatureApparent;
              pair['hum'] = dvalue.humidity;
              pair['vis'] = dvalue.visibility;
              pair['cover'] = dvalue.cloudCover;
              pair['wcode'] = dvalue.weatherCode;
              pair['uvIndex'] = dvalue.uvIndex;
              pair['preci'] = dvalue.precipitationProbability;
              pair['pre'] = dvalue.pressureSeaLevel;

              let strwcode = dvalue.weatherCode.toString();
              pair['icon'] = wCReference[strwcode]['icon'];
              pair['des'] = wCReference[strwcode]['description'];
              daily.push(pair);
          }
          let dailyres = {};
          dailyres['daily'] = daily;
          dailyres['status'] = 'OK';
          res.json(dailyres);
          //=> '<!doctype html> ...'
        } catch (error) {
          let errm = {};
          errm['status'] = 'Bad';
          res.json(errm);
          console.log(error.response.body);
          //=> 'Internal server error ...'
        }
    })();
});

app.get('/api/weather',function(req,res){
    chOneList = [];
    const loc = req.query.loc;
    let url = 'https://api.tomorrow.io/v4/timelines?location='+ loc + '&fields=';
    let tfield = ["temperature","temperatureApparent","temperatureMin","temperatureMax","humidity","windSpeed","windDirection","pressureSeaLevel","visibility","cloudCover","uvIndex","weatherCode","precipitationProbability","precipitationType","sunriseTime","sunsetTime","moonPhase"];
    for(let i = 0, len = tfield.length; i < len; i++){
        url = url + tfield[i] + ',';
    }
    url = url.substring(0,url.length-1);
    console.log(url);
    url = url + '&timesteps=' + '1d';
    url = url + '&units=imperial&timezone=America/Los_Angeles';
    url = url + '&apikey=' + 'SQt1c6WRv87CVfrjX2S8s8R3SQdNScN6';
    console.log(url);
    (async () => {
        try {
          const response = await got(url);
        //   console.log(response);
          let body = JSON.parse(response.body);
          if(!body.data.timelines[0].intervals){
            throw 'tolimit';
          }
          let dwea = body.data.timelines[0].intervals;
          console.log(dwea);
          let daily = [];
          for(let i = 0, len = dwea.length; i < len; i++){
              let pair = {};
              let dvalue = dwea[i].values;
              let startTime = dwea[i].startTime;
              pair['originTime'] = startTime;
              
              let d = new Date(startTime.substring(0,10));
              chOneList[i]=[];
              chOneList[i][0] = Date.parse(d);
              chOneList[i][1] = dvalue.temperatureMin;
              chOneList[i][2] = dvalue.temperatureMax;
              d.setDate(d.getDate() + 1);
              var weekday = d.toLocaleDateString('en-US',{weekday:"long"});
              var days = d.toLocaleDateString('en-US',{day:"2-digit"});
              var months = d.toLocaleDateString('en-US',{month:"short"});
              var years = d.toLocaleDateString('en-US',{year:"numeric"});
              var showTime = weekday + ', ' + days + " " + months + " " + years;
              pair['showTime'] = showTime;
              
              
              pair['max'] = dvalue.temperatureMax;
              pair['min'] = dvalue.temperatureMin;
              pair['ws'] = dvalue.windSpeed;
              pair['appt'] = dvalue.temperatureApparent;
              pair['sunrise'] = dvalue.sunriseTime.substring(11,19);
              pair['sunset'] = dvalue.sunsetTime.substring(11,19);
              pair['hum'] = dvalue.humidity;
              pair['vis'] = dvalue.visibility;
              pair['cover'] = dvalue.cloudCover;
              pair['wcode'] = dvalue.weatherCode;
              let strwcode = dvalue.weatherCode.toString();
              pair['icon'] = wCReference[strwcode]['icon'];
              pair['des'] = wCReference[strwcode]['description'];
              daily.push(pair);
          }
          let dailyres = {};
          dailyres['daily'] = daily;
          dailyres['mmdata'] = chOneList; 
          dailyres['status'] = 'OK';
          res.json(dailyres);
          //=> '<!doctype html> ...'
        } catch (error) {
          let errm = {};
          errm['status'] = 'Bad';
          res.json(errm);
          console.log(error.response.body);
          //=> 'Internal server error ...'
        }
    })();
});


module.exports = router;
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;