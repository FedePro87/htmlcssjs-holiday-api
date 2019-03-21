function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getMonthName(month){
  var mom=moment();
  mom.month(month);
  mom.locale("it");
  var monthName=mom.format("MMMM");
  monthName=capitalizeFirstLetter(monthName);
  return monthName;
}

function getMonthDayCount(year,month){
  var mom=moment();
  mom.year(year);
  mom.month(month);
  var dayCount=mom.daysInMonth();
  return dayCount;
}

function getHumanDate(year,month,day) {
  var mom=moment();
  mom.year(year);
  mom.month(month);
  mom.date(day);

  var date=mom.format("DD MMMM YY");
  return date;
}

function printTitle(year,month){
  var h1MonthName=$("#month-name");
  var monthName=getMonthName(month);
  var dayCount=getMonthDayCount(year,month);
  h1MonthName.text(monthName + " " + year + ": 1-" + dayCount);
}

function printDays(year,month) {
  var dayCount=getMonthDayCount(year,month);
  var daysContainer=$(".days-container");
  var template=$("#box-template").html();
  var compiled=Handlebars.compile(template);
  var dayOfBox=0;
  var dayOfWeek= getDayOfWeek(year,month,1);
  var day=1;

  for (var i = 0; i <35; i++) {
    if (dayOfBox>6) {
      dayOfBox=0
    }

    if (dayOfWeek>6) {
      dayOfWeek=0
    }

    if (day>dayCount) {
      var box=compiled();
      daysContainer.append(box);
    } else if (dayOfWeek==dayOfBox) {
      var templateDay={
        machineDate:getMachineDate(year,month,day),
        dayText:day + " " + getDayName(dayOfWeek)
      }
      var box=compiled(templateDay);
      daysContainer.append(box);
      dayOfWeek++;
      day++;
    } else {
      var box=compiled();
      daysContainer.append(box);
    }

    dayOfBox++;
  }
}

function getDayName(dayOfWeek){
  var mom= moment();
  mom.day(dayOfWeek);
  mom.locale("it");
  var dayName= mom.format("ddd");
  dayName=capitalizeFirstLetter(dayName);
  return dayName;
}

function getDayOfWeek(year,month,day) {
  var mom=moment();
  mom.year(year);
  mom.month(month);
  mom.date(day);
  return mom.day();
}

function getMachineDate(year, month, day) {
  var mom=moment();
  mom.year(year);
  mom.month(month);
  mom.date(day);

  var date=mom.format("YYYY-MM-DD");
  return date;
}

function printHolidays(year,month) {
  var outData={
    year:year,
    month:month
  }

  $.ajax({
    url:"https://flynn.boolean.careers/exercises/api/holidays",
    data:outData,
    method:"GET",
    success:function(inData,state){
      if (inData.success) {
        var holidays=inData.response;
        addHolidays(holidays);
      } else {
        console.log("Communication error");
      }
    },
    error:function(request,state,error){
      console.log(request);
      console.log(state);
      console.log(error);
    }
  });
}

function addHolidays(holidays){
  for (var i = 0; i < holidays.length; i++) {
    var holiday=holidays[i];
    var holidayMachineDate= holiday.date;
    var holidayName=holiday.name;
    var boxHolidayName= document.createElement("p");
    $(boxHolidayName).text(holidayName)
    .addClass("holiday-name");
    var boxHoliday=$(".box[data-date='" + holidayMachineDate +"']")
    boxHoliday.addClass("holiday")
    .append(boxHolidayName);
  }
}

function init(){
  var previousMonth=$("#previous-month");
  var nextMonth=$("#next-month");
  var daysContainer=$(".days-container");
  var year=2018;
  var month=0;
  printTitle(year,month);
  printDays(year,month);
  printHolidays(year, month);

  nextMonth.click(function(){
    daysContainer.html("");
    month++;
    if (month>11) {
      month=0;
    }
    printTitle(year,month);
    printDays(year,month);
    printHolidays(year, month);
  });

  previousMonth.click(function(){
    daysContainer.html("");
    month--;
    if (month<0) {
      month=11;
    }
    printTitle(year,month);
    printDays(year,month);
    printHolidays(year, month);
  });
}

$(document).ready(init);
