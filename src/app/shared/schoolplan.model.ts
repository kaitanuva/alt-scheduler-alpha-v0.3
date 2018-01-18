export class SchoolPlan{
  public name: string;
  public year: number;
  public month: number;
  public date: number;
  public day: string;
  public period1: string;
  public period2: string;
  public period3: string;
  public period4: string;
  public period5: string;
  public period6: string;
  public class1: string;
  public class2: string;
  public class3: string;
  public class4: string;
  public class5: string;
  public class6: string;
  public teacher1: string;
  public teacher2: string;
  public teacher3: string;
  public teacher4: string;
  public teacher5: string;
  public teacher6: string;
  public lesson1: string;
  public lesson2: string;
  public lesson3: string;
  public lesson4: string;
  public lesson5: string;
  public lesson6: string;
  public lunch: string;
  public classLunch: string;
  public teacherLunch: string;
  public status: string;
  public time: string;
  public comment: string;
  public key: string;
  public deleteSchoolKey: string;
  public deleteSchoolPlanKey: string;
  public alt: string;

  constructor(
    name: string,
    year: number,
    month: number,
    date: number,
    day: string,
    period1: string,
    period2: string,
    period3: string,
    period4: string,
    period5: string,
    period6: string,
    class1: string,
    class2: string,
    class3: string,
    class4: string,
    class5: string,
    class6: string,
    teacher1: string,
    teacher2: string,
    teacher3: string,
    teacher4: string,
    teacher5: string,
    teacher6: string,
    lesson1: string,
    lesson2: string,
    lesson3: string,
    lesson4: string,
    lesson5: string,
    lesson6: string,
    lunch: string,
    classLunch: string,
    teacherLunch: string,
    comment: string,
  ){
    this.name = name;
    this.year = year;
    this.month = month;
    this.date = date;
    this.day = day;
    this.period1 = period1;
    this.period2 = period2;
    this.period3 = period3;
    this.period4 = period4;
    this.period5 = period5;
    this.period6 = period6;
    this.class1 = class1;
    this.class2 = class2;
    this.class3 = class3;
    this.class4 = class4;
    this.class5 = class5;
    this.class6 = class6;
    this.teacher1 = teacher1;
    this.teacher2 = teacher2;
    this.teacher3 = teacher3;
    this.teacher4 = teacher4;
    this.teacher5 = teacher5;
    this.teacher6 = teacher6;
    this.lesson1 = lesson1;
    this.lesson2 = lesson2;
    this.lesson3 = lesson3;
    this.lesson4 = lesson4;
    this.lesson5 = lesson5;
    this.lesson6 = lesson6;
    this.lunch = lunch;
    this.classLunch = classLunch;
    this.teacherLunch = teacherLunch;
    this.comment = comment;
  }
}