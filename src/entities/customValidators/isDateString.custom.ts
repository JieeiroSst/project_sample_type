import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator'
import * as moment from 'moment'

@ValidatorConstraint()
class IsDateStringConstraints implements ValidatorConstraintInterface {
  private readonly val: (inp: string, format: string) => boolean
  constructor() {
    this.val = (inp: string, format: string) => moment(inp, format).isValid()
  }
  validate(textThatShouldBeDate: string, args: ValidationArguments): boolean {
    return (
      this.val(textThatShouldBeDate, 'MM/DD/YYYY') ||
      this.val(textThatShouldBeDate, 'DD/MM/YYYY') ||
      textThatShouldBeDate === null
    )
  }

  defaultMessage(args: ValidationArguments): string {
    const { property } = args
    return `${property} should be in format DD/MM/YYYY or DD-MM-YYYY`
  }
}

export function IsDateStringCustom(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName, 
      options: validationOptions,
      validator: IsDateStringConstraints,
      async: false,
    })
  }
}
