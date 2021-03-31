// jshint esversion: 8
// import 'google-apps-script';
if (typeof require !== 'undefined') {
  MockData = require ('../MockData.js');
}
/**
 * Gets calendar events and stores them as a 2D Array
 */
let Events = (function() {

  const _testData = JSON.parse('[["Start Time","End Time","Title","Location","Confirmed","Guests"],["2021-03-23T16:00:00.000Z","2021-03-23T17:00:00.000Z","Busy","",true,[]],["2021-03-23T22:00:00.000Z","2021-03-24T04:00:00.000Z","Sleep","",true,[]],["2021-03-24T16:00:00.000Z","2021-03-24T17:00:00.000Z","Busy","",true,[]],["2021-03-24T22:00:00.000Z","2021-03-25T04:00:00.000Z","Sleep","",true,[]],["2021-03-25T16:00:00.000Z","2021-03-25T17:00:00.000Z","Busy","",true,[]],["2021-03-25T22:00:00.000Z","2021-03-26T04:00:00.000Z","Sleep","",true,[]],["2021-03-26T15:00:00.000Z","2021-03-26T16:00:00.000Z","Busy","",true,[]],["2021-03-26T16:00:00.000Z","2021-03-26T17:00:00.000Z","Busy","",true,[]],["2021-03-26T22:00:00.000Z","2021-03-27T04:00:00.000Z","Sleep","",true,[]],["2021-03-27T22:00:00.000Z","2021-03-28T04:00:00.000Z","Sleep","",true,[]],["2021-03-28T16:30:00.000Z","2021-03-28T18:30:00.000Z","Косыскимы","https://zoom.us/j/99476920957?pwd=WGJRWitpK3E3RHZKanJ4YnVwMWtSUT09",true,[]],["2021-03-28T21:00:00.000Z","2021-03-29T03:00:00.000Z","Sleep","",true,[]],["2021-03-29T09:30:00.000Z","2021-03-29T10:00:00.000Z","Weekly Dmitry & Philippe Call","",true,["dmitry.kostyuk@gmail.com"]],["2021-03-29T15:00:00.000Z","2021-03-29T16:00:00.000Z","Busy","",true,[]],["2021-03-29T21:00:00.000Z","2021-03-30T03:00:00.000Z","Sleep","",true,[]],["2021-03-30T15:00:00.000Z","2021-03-30T16:00:00.000Z","Busy","",true,[]],["2021-03-30T21:00:00.000Z","2021-03-31T03:00:00.000Z","Sleep","",true,[]],["2021-03-31T15:00:00.000Z","2021-03-31T16:00:00.000Z","Busy","",true,[]],["2021-03-31T21:00:00.000Z","2021-04-01T03:00:00.000Z","Sleep","",true,[]],["2021-04-01T15:00:00.000Z","2021-04-01T16:00:00.000Z","Busy","",true,[]],["2021-04-01T21:00:00.000Z","2021-04-02T03:00:00.000Z","Sleep","",true,[]],["2021-04-02T14:00:00.000Z","2021-04-02T15:00:00.000Z","Busy","",true,[]],["2021-04-02T15:00:00.000Z","2021-04-02T16:00:00.000Z","Busy","",true,[]],["2021-04-02T21:00:00.000Z","2021-04-03T03:00:00.000Z","Sleep","",true,[]],["2021-04-03T21:00:00.000Z","2021-04-04T03:00:00.000Z","Sleep","",true,[]],["2021-04-04T16:30:00.000Z","2021-04-04T18:30:00.000Z","Косыскимы","https://zoom.us/j/99476920957?pwd=WGJRWitpK3E3RHZKanJ4YnVwMWtSUT09",true,[]],["2021-04-04T21:00:00.000Z","2021-04-05T03:00:00.000Z","Sleep","",true,[]],["2021-04-05T09:30:00.000Z","2021-04-05T10:00:00.000Z","Weekly Dmitry & Philippe Call","",true,["dmitry.kostyuk@gmail.com"]],["2021-04-05T15:00:00.000Z","2021-04-05T16:00:00.000Z","Busy","",true,[]],["2021-04-05T21:00:00.000Z","2021-04-06T03:00:00.000Z","Sleep","",true,[]]]');
  let mockData;
  if (typeof CalendarApp === 'undefined') mockData = new MockData().addData('testCalData', _testData);

  const _events = new WeakMap();

  class Events {

    constructor(startTime, endTime, calId) {
      if (!(startTime instanceof Date)) throw new Error('startTime is not a valid date-time format');
      if (!(endTime instanceof Date)) throw new Error('endTime is not a valid date-time format');
      const headers = ['Start Time', 'End Time', 'Title', 'Location', 'Confirmed', 'Guests'];
      _events.set(this, [headers]);
      if (mockData) {
        _events.set(this, mockData.getData('testCalData'));
        return this;
      } 
      const calendar = calId ? CalendarApp.getCalendarById(calId) : CalendarApp.getDefaultCalendar();
      const events = calendar.getEvents(startTime, endTime);
      const status = CalendarApp.GuestStatus;
      events.forEach(event => {
        _events.get(this).push([
          event.getStartTime(), 
          event.getEndTime(),
          event.getTitle(),
          event.getLocation(),
          [status.YES, status.OWNER].includes(event.getMyStatus()),
          event.getGuestList().map(guest => guest.getEmail())
        ]);
      });
      return this;
    }

    get(row) {
      if (row !== undefined) return _events.get(this)[row];
      return _events.get(this);
    }

    print(row) {
      console.log(JSON.stringify(this.get(row)));
      return true;
    }
  }

  return Events;
  
})();

if (typeof module !== 'undefined') module.exports = Events;