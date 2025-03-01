export class DateUtil {
  static formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  static now(): Date {
    return new Date();
  }
}
