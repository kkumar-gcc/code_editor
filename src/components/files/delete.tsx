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

export default function DeleteFile(props: UseDisclosureProps & { file: any | null }) {
    const router = useRouter();
    const [fileId, setFolderId] = React.useState();

    const [errors , setErrors] = React.useState({} as any);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDisabled, setIsDisabled] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsDisabled(true);
        setIsSubmitting(true);
        const formURL = `/api/files/${fileId}`;

        try {
            const res = await fetch(formURL, {
                method: "DELETE",
            });

            if (res.status === 200) {
                // @ts-ignore
                props.onClose();
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            setErrors({ message: "An error occurred while deleting the file." });
        } finally {
            setIsDisabled(false);
            setIsSubmitting(false);
        }
    }

    // Use useEffect to reset folderId when the component is unmounted
    React.useEffect(() => {
        setFolderId(props.file?.id);
        setIsDisabled(false);
        setIsSubmitting(false);
        setErrors({});
    }, [props.isOpen, props.file]);

    return (
        <>
            <Modal backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Delete folder</ModalHeader>
                                <ModalBody>
                                    {errors.message && (
                                        <p className="mb-3 text-red-600">
                                            {errors.message}
                                        </p>
                                    )}
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
