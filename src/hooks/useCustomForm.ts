import React from "react";
import {CustomError} from "@/types/customError"

export function useCustomForm<TFormData>(
    initialValues: TFormData,
    submitHandler: (formData: TFormData, setError: (error: CustomError) => void) => Promise<any>
) {
    const [state, setState] = React.useState<TFormData>(initialValues);
    const [errors, setErrors] = React.useState<CustomError[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDisabled, setIsDisabled] = React.useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value.length > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const setError = (error: CustomError) => {
            setErrors([...errors, error]);
        };

        try {
            await submitHandler(state, setError);
        } catch (e) {
            console.error(e);
            setErrors([...errors, new CustomError("An error occurred while creating the folder.")]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setState(initialValues);
        setIsDisabled(true);
        setIsSubmitting(false);
        setErrors([]);
    };

    return {
        state,
        setState,
        errors,
        isSubmitting,
        setIsSubmitting,
        isDisabled,
        setIsDisabled,
        handleChange,
        handleSubmit,
        resetForm,
    };
}
