import { AbstractControl } from '@angular/forms';

export class PasswordConfirm {
    static confirmPassword(abstractControl: AbstractControl) {
        const password = abstractControl.get('password').value;
        const confirmPassword = abstractControl.get('confirmPassword').value;

        if (password !== confirmPassword) {
            abstractControl.get('confirmPassword').setErrors({ MatchPassword: true });
        } else {
            return null;
        }
    }
}
