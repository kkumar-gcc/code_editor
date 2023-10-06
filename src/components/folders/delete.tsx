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
import Errors from "@/components/errors";

export default function DeleteFolder(props: UseDisclosureProps & { folder: any | null }) {
    const router = useRouter();

    const {errors, isSubmitting, isDisabled, handleSubmit, resetForm, setIsDisabled } = useCustomForm(
        {
            folderId: props.folder?.id,
        },
        async (formData, setError) => {
            const formURL = `/api/folders/${props.folder.id}`;

            const res = await fetch(formURL, {
                method: "DELETE",
            });

            if (res.status === 200) {
                // @ts-ignore
                props.onClose();
                router.refresh();
            } else {
                setError(new CustomError("An error occurred while deleting the folder."));
            }
        }
    );

    React.useEffect(() => {
        resetForm();
        setIsDisabled(false);
    },[props.isOpen, props.folder]);

    return (
        <>
            <Modal backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Delete folder</ModalHeader>
                                <ModalBody>
                                    <Errors errors={errors} />
                                    <p>Do you really want to delete this folder?</p>
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
