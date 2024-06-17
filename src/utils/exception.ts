export class Exception extends Error {
  private status: number;

  constructor(status: number, error: Error) {
    super();
    this.message = error.message;
    this.status = status || 500;
    this.handleMessage(error);
  }

  private handleMessage(error) {
    if (typeof error == 'string') {
      this.message = error;
    }
  }
}
