import { Subject } from 'rxjs/Subject';

export class TimeService{
  dateChanged = new Subject<{year: number, month: number}>();
  dayChanged = new Subject<number>();
  selectedYear: number;
  selectedMonth: number;
  selectedDate: number;
  altClickedYear: number;
  altClickedMonth: number;

  constructor(){}

  getNextMonth(year: number, month: number){
    if (month == 11){
      year++;
      month = 0;
      this.dateChanged.next({year, month});
    }
    else{
      month++;
      this.dateChanged.next({year, month});
    }
  }

  getPrevMonth(year: number, month: number){
    if (month == 0){
      year--;
      month = 11;
      this.dateChanged.next({year, month});
    }
    else{
      month--;
      this.dateChanged.next({year, month});
    }
  }

  getLastDate(currentYear: number, currentMonth: number){
    let nextMonth: number;
    let theYear: number;
    if (currentMonth == 11){
      nextMonth = 0;
      theYear = currentYear + 1;
    }
    else {
      nextMonth = currentMonth + 1;
      theYear = currentYear;
    }
    let newDate = new Date(theYear, nextMonth);
    newDate.setDate(newDate.getDate() - 1);
    return newDate.getDate();
  }

  getDay(year: number, month: number, date: number){
    let days = ['日', '月', '火', '水', '木', '金', '土'];
    let theDate = new Date(year, month, date);
    return days[theDate.getDay()];
  }

  isWeekend(year: number, month: number, date: number){
    let checkDate = new Date(year, month, date);
    switch(checkDate.getDay()){
      case 6:
      case 0:
        return true;
      default:
        return false;
    }  
  }
}