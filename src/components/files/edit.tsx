"use client"
import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input
} from "@nextui-org/react";
import {UseDisclosureProps} from "@nextui-org/use-disclosure";
import {File as FileIcon} from "@geist-ui/icons";
import {useRouter} from "next/navigation";
import {useCustomForm} from "@/hooks/useCustomForm";
import {CustomError} from "@/types/customError";

export default function EditFile(props: UseDisclosureProps & { file: any | null }) {
    const router = useRouter();
    const { state, setState, errors, isSubmitting, isDisabled, setIsDisabled, handleSubmit, resetForm } = useCustomForm(
        {
            name: props.file?.name,
        },
        async (formData, setError) => {
            const formURL = `/api/files/${props.file.id}`;

            const res = await fetch(formURL, {
                method: "PUT",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 200) {
                // @ts-ignore
                props.onClose();
                router.refresh();
            } else {
                setError(new CustomError("An error occurred while editing the file."));
            }
        }
    );

    // custom handle change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 0 && e.target.value !== props.file.name) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    }

    React.useEffect(() => {
        resetForm();
    },[props.isOpen, props.file]);

    return (
        <>
            <Modal backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Edit file</ModalHeader>
                                <ModalBody>
                                    {errors.map((error, index) => (
                                        <p key={index}>
                                            {error.message}
                                        </p>
                                    ))}
                                    <Input
                                        autoFocus
                                        endContent={
                                            <FileIcon size={24} className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                                        }
                                        label="Name"
                                        placeholder="Enter your file name"
                                        variant="bordered"
                                        name="name"
                                        value={state.name}
                                        onChange={handleChange}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button type={"submit"} className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"} disabled={isDisabled} isLoading={isSubmitting}>
                                        Edit
                                    </Button>
                                    <Button className={"bg-white border shadow rounded-lg"}  onPress={onClose}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
