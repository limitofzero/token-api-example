import { FormControl } from '@angular/forms';
import { isAddress } from "ethers/lib/utils";

export function validateAddress(control: FormControl) {
    return isAddress(control.value as string) ? null : { invalidAddress: true };
}
