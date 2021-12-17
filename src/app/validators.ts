import { FormControl } from "@angular/forms";
import { ethers } from "ethers";

export function validateAddress(control: FormControl) {
    return ethers.utils.isAddress(control.value) ? null : { invalidAddress: true }
}
