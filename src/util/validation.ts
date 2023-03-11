export interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

export function validate(validatableInput: Validatable) {
	let isValid = true;
	if (validatableInput.required) {
		isValid = isValid && !!validatableInput.value;
	}
	// String validations
	if (
		validatableInput.minLength &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid &&
			validatableInput.value.toString().trim().length >
				validatableInput.minLength;
	}
	if (
		validatableInput.maxLength &&
		typeof validatableInput.value === "string"
	) {
		isValid =
			isValid &&
			validatableInput.value.toString().trim().length <
				validatableInput.maxLength;
	}
	// Numerical validations
	if (validatableInput.min && typeof validatableInput.value === "number") {
		isValid = isValid && validatableInput.value >= validatableInput.min;
	}
	if (validatableInput.max && typeof validatableInput.value === "number") {
		isValid = isValid && validatableInput.value <= validatableInput.max;
	}
	return isValid;
}
