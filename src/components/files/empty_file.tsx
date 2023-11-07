import {UseDisclosureProps} from "@nextui-org/use-disclosure";
import {useRouter} from "next/navigation";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import Errors from "@/components/errors";
import {File as FileIcon} from "@geist-ui/icons";
import React from "react";
import {useCustomForm} from "@/hooks/useCustomForm";
import {CustomError} from "@/types/customError";


export default function EmptyFile(props: UseDisclosureProps & { parentId: string | null }) {
    const router = useRouter();

    const { state, errors, isSubmitting, isDisabled, handleChange, handleSubmit, resetForm } = useCustomForm(
        {
            name: "",
            isEmpty: true,
        },
        async (formData, setError) => {
            let formURL = `/api/files/${props.parentId ?? ''}`;
            const data = new FormData();
            data.set('name', formData.name);
            data.set('isEmpty', formData.isEmpty.toString());

            const res = await fetch(formURL, {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                // @ts-ignore
                props.onClose();
                router.refresh();
            } else {
                setError(new CustomError("An error occurred while creating the file."));
            }
        }
    );

    React.useEffect(() => {
        resetForm()
    },[props.isOpen, props.parentId]);

    return (
        <>
            <Modal backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Create an empty file</ModalHeader>
                                <ModalBody>
                                    <Errors errors={errors} />
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