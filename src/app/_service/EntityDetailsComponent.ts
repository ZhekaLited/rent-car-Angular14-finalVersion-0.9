import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Component, ElementRef, Input, Output} from "@angular/core";
import {ComponentBase} from "./component-base";

@Component({
  template: ''
})
export abstract class EntityDetailsComponent extends ComponentBase {
  @Input() @Output()
  public submitted: boolean = false;

  public isClosed: boolean = false;
  public isReadonly: boolean = false;

  public detailsForm: FormGroup = new FormGroup({});

  get t() {
    return this.detailsForm.controls;
  }

  constructor(
    protected route: ActivatedRoute,
    protected fb: FormBuilder,
    protected router: Router
  ) {
    super();

  }

  protected getFormValue(formField: string): any {
    return this.detailsForm.get(formField)?.value
  }

  protected setCaretToPosition(input: ElementRef, position: string) {
    if (input.nativeElement.setSelectionRange && position) {
      setTimeout(() => {
        input.nativeElement.focus();
        input.nativeElement.setSelectionRange(position, position);
      });
    }
  }

  protected setFormValue(formField: string, value: any): void {
    return this.detailsForm.get(formField)?.patchValue(value);
  }


  protected validateAllFormFields(formGroup: FormGroup): boolean {
    if (!formGroup || !formGroup.controls) {
      return false;
    }

    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });

    this.logValidationErrors(formGroup);
    return formGroup.valid;
  }

  /**
   * Saves the details form.
   */
  protected abstract saveInternal(): any;

  protected preValidate(preValidationFunction?: Function): void {
    if (preValidationFunction) {
      preValidationFunction();
    }
  }

  /**
   * Validates the current form and calls the saveInternal() function. Do not overrides this method unless absolutely necessary.
   */
  public save(preValidationFunction?: Function, shouldRedirect: boolean = true): void {
    this.preValidate(preValidationFunction);

    if (!this.validate()) {
      return;
    }

    this.saveInternal();
    // this.router.navigate(["/orderList"]);
  }

  public resetForm(resetSubmitted: boolean = false) {
    this.detailsForm.reset();

    this.submitted = !resetSubmitted;
  }

  public resetSubmit() {
    this.submitted = false;
  }

  public validate(): boolean {
    this.submitted = true;

    return (this.validateAllFormFields(this.detailsForm) && this.detailsForm.valid);
  }

  /**
   * Logs all validation errors to the console.
   */
  private logValidationErrors(form: FormGroup) {
    if (!form || !form.controls) {
      return;
    }
    if (!form.valid) {
      // console.error("Form invalid!");
    }

    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors)
          .forEach(() => {
            // console.log("Key control: " + key + ", keyError: " + keyError + ", err value: ", controlErrors[keyError]);
          });
      }
    });
  }
}
