export default class CustomError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message); // Call the constructor of the base class `Error`
    this.status = status; // Set the error name to your custom error class name
    this.data = data;
    // Set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
