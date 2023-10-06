"use client"
import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import {UseDisclosureProps} from "@nextui-org/use-disclosure";
import {useRouter} from "next/navigation";
import {useCustomForm} from "@/hooks/useCustomForm";
import {CustomError} from "@/types/customError";

export default function DeleteFile(props: UseDisclosureProps & { file: any | null }) {
    const router = useRouter();
    const {state, errors, isSubmitting, isDisabled, handleSubmit, resetForm, setIsDisabled } = useCustomForm(
        {
            fileId: props.file?.id,
        },
        async (formData, setError) => {
            const formURL = `/api/files/${state.fileId}`;

            const res = await fetch(formURL, {
                method: "DELETE",
            });

            if (res.status === 200) {
                // @ts-ignore
                props.onClose();
                router.refresh();
            } else {
                setError(new CustomError("An error occurred while deleting the file."));
            }
        }
    );

    React.useEffect(() => {
        resetForm();
        setIsDisabled(false);
    },[props.isOpen, props.file]);

    return (
        <>
            <Modal backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Delete folder</ModalHeader>
                                <ModalBody>
                                    {errors.map((error, index) => (
                                        <p key={index}>
                                            {error.message}
                                        </p>
                                    ))}
                                    <p>Do you really want to delete this file?</p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type={"submit"} className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"} disabled={isDisabled} isLoading={isSubmitting}>
                                        Delete
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
