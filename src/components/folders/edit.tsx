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
import {Folder as FolderIcon} from "@/components/geist-ui/icons";
import {useRouter} from "next/navigation";
import {useCustomForm} from "@/hooks/useCustomForm";
import {CustomError} from "@/types/customError";
import Errors from "@/components/errors";

export default function EditFolder(props: UseDisclosureProps & { folder: any | null }) {
    const router = useRouter();
    const { state, errors, isSubmitting, isDisabled, handleChange, handleSubmit, resetForm } = useCustomForm(
        {
            name: props.folder?.name,
        },
        async (formData, setError) => {
            const formURL = `/api/folders/${props.folder.id}`;

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
                setError(new CustomError("An error occurred while editing the folder."));
            }
        }
    );

    React.useEffect(() => {
        resetForm();
    },[props.isOpen, props.folder]);

    return (
        <>
            <Modal backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit} action={"/api/folders"}>
                                <ModalHeader className="flex flex-col gap-1">Edit the folder</ModalHeader>
                                <ModalBody>
                                    <Errors errors={errors} />
                                    <Input
                                        autoFocus
                                        endContent={
                                            <FolderIcon size={24} className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                                        }
                                        label="Name"
                                        placeholder="Enter your folder name"
                                        variant="bordered"
                                        name="name"
                                        value={state.name}
                                        onChange={handleChange}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button type={"submit"} className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"} disabled={isDisabled} isLoading={isSubmitting}>
                                        Create
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
