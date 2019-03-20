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
  var ulDayList=$("#day-list");
  var mom=moment();
  mom.month(month);
  mom.year(year);

  var template=$("#day-template").html();
  var compiled=Handlebars.compile(template);

  for (var day = 1; day <=dayCount; day++) {
    var templateDate={
      machineDate:getMachineDate(year,month,day),
      date: getHumanDate(year,month,day)
    }

    var liDay=compiled(templateDate);
    ulDayList.append(liDay);
  }
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
    var liHoliday=$("li[data-date='" + holidayMachineDate +"']")
    liHoliday.addClass("holiday");
    liHoliday.text(liHoliday.text() + " - " + holidayName);
  }
}

function init(){
  var previousMonth=$("#previous-month");
  var nextMonth=$("#next-month");
  var ulDayList=$("#day-list");
  var year=2018;
  var month=0;
  printTitle(year,month);
  printDays(year,month);
  printHolidays(year, month);

  nextMonth.click(function(){
    ulDayList.html("");
    month++;
    if (month>11) {
      month=0;
    }
    printTitle(year,month);
    printDays(year,month);
    printHolidays(year, month);
  });

  previousMonth.click(function(){
    ulDayList.html("");
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
