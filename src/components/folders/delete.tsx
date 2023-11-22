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
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

const schema = yup
    .object({
        folderId: yup.string().required(),
    })
    .required();

export default function DeleteFolder(props: UseDisclosureProps & { folder: any | null }) {
    const router = useRouter();

    const {
        setError,
        handleSubmit,
        reset,
        clearErrors,
        formState: {errors, isSubmitting}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            folderId: props.folder?.id as string
        }
    });

    const onSubmit = handleSubmit((data) => {
        const formURL = `/api/folders/${props.folder.id}`;

        fetch(formURL, {
            method: "DELETE"
        }).then((res) => {
            if (res.status === 200) {
                // @ts-ignore
                props.onClose();
                router.refresh();
            } else {
                setError("root.random", {
                    message: "an error occurred while deleting the folder",
                    type: "random",
                })
            }
        }).catch((err) => {
            console.error(err);
        })
    })

    React.useEffect(() => {
        if (props.isOpen && props.folder) {
            reset({folderId: props.folder?.id as string})
            clearErrors()
        }
    }, [clearErrors, reset, props])

    return (
        <>
            <Modal backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={onSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Delete folder</ModalHeader>
                                <ModalBody>
                                    {errors.root?.random && <p role="alert" className={"text-rose-600"}>{errors.root?.random.message}</p>}
                                    <p>Do you really want to delete this folder?</p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type={"submit"} className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"} isLoading={isSubmitting}>
                                        Delete folder
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
