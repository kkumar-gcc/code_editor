import {UseDisclosureProps} from "@nextui-org/use-disclosure";
import {useRouter} from "next/navigation";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {File as FileIcon} from "@geist-ui/icons";
import React from "react";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

const schema = yup
    .object({
        name: yup.string().required(),
        isEmpty: yup.boolean().required(),
    })
    .required();

export default function EmptyFile(props: UseDisclosureProps & { parentId: string | null }) {
    const router = useRouter();

    const {
        register,
        setError,
        handleSubmit,
        reset,
        clearErrors,
        formState: {errors, isSubmitting, isDirty, isValid}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            isEmpty: true
        }
    });

    const onSubmit = handleSubmit((data) => {
        let formURL = `/api/files/${props.parentId ?? ''}`;
        const formData = new FormData();
        formData.set('name', data.name);
        formData.set('isEmpty', data.isEmpty.toString());

        fetch(formURL, {
            method: 'POST',
            body: formData,
        }).then((res) => {
            if (res.status === 200) {
                // @ts-ignore
                props.onClose();
                router.refresh();
            } else {
                setError("root.random", {
                    message: "an error occurred while creating the file",
                    type: "random",
                })
            }
        }).catch((err) => {
            console.error(err);
        })
    });

    React.useEffect(() => {
        if (props.isOpen && props.parentId) {
            reset({name: ""})
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
                                <ModalHeader className="flex flex-col gap-1">Create an empty file</ModalHeader>
                                <ModalBody>
                                    {errors.root?.random &&
                                        <p role="alert" className={"text-rose-600"}>{errors.root?.random.message}</p>}
                                    <Input
                                        autoFocus
                                        endContent={
                                            <FileIcon size={24}
                                                      className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                                        }
                                        label="Name"
                                        placeholder="Enter your file name"
                                        variant="bordered"
                                        {...register("name")}
                                    />
                                    {errors.name &&
                                        <p role="alert" className={"text-rose-600"}>{errors.name.message}</p>}
                                </ModalBody>
                                <ModalFooter>
                                    <Button type={"submit"}
                                            className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"}
                                            disabled={!isDirty || !isValid} isLoading={isSubmitting}>
                                        Create file
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