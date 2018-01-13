export class School{
  public name: string;
  public year: number;
  public month: number;
  public date: number;
  public time: string;
  public key: string;

  constructor(
    name: string, 
    year: number, 
    month: number, 
    date: number,
    time: string
    ){
      this.name = name;
      this.year = year;
      this.month = month;
      this.date = date;
      this.time = time;
  }
}