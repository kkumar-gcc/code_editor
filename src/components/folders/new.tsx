"use client"
import React from "react";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {UseDisclosureProps} from "@nextui-org/use-disclosure";
import {Folder as FolderIcon} from "@/components/geist-ui/icons";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

const schema = yup
    .object({
        name: yup.string().required(),
    })
    .required();

export default function NewFolder(props: UseDisclosureProps & { parentId: string | null }) {
    const router = useRouter();
    const {
        register,
        setError,
        handleSubmit,
        reset,
        clearErrors,
        formState: {errors, isSubmitSuccessful, isSubmitting, isDirty, isValid}
    } = useForm({resolver: yupResolver(schema)});

    const onSubmit = handleSubmit((data) => {
        let formURL = `/api/folders/${props.parentId ?? ''}`;

        fetch(formURL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            if (res.status === 200) {
                // @ts-ignore
                props.onClose();
                router.refresh();
            } else {
                setError("root.random", {
                    message: "an error occurred while creating the folder",
                    type: "random",
                })
            }
        }).catch((err) => {
            console.error(err);
        })
    })

    React.useEffect(() => {
        if (isSubmitSuccessful || (props.isOpen && props.parentId)) {
            reset({name: ""})
            clearErrors()
        }
    }, [clearErrors, isSubmitSuccessful, reset, props])
    return (
        <>
            <Modal backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={onSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Create a folder</ModalHeader>
                                <ModalBody>
                                    {errors.root?.random && <p role="alert" className={"text-rose-600"}>{errors.root?.random.message}</p>}
                                    <Input
                                        autoFocus
                                        endContent={
                                            <FolderIcon size={24}
                                                        className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                                        }
                                        label="Name"
                                        {...register("name")}
                                        placeholder="Enter your folder name"
                                        variant="bordered"
                                        aria-invalid={errors.name ? "true" : "false"}
                                    />
                                    {errors.name && <p role="alert" className={"text-rose-600"}>{errors.name.message}</p>}
                                </ModalBody>
                                <ModalFooter>
                                    <Button type={"submit"}
                                            className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"}
                                            disabled={!isDirty || !isValid} isLoading={isSubmitting}>
                                        Create
                                    </Button>
                                    <Button className={"bg-white border shadow rounded-lg"} onPress={onClose}>
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
