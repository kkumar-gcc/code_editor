"use client"
import React from "react";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {UseDisclosureProps} from "@nextui-org/use-disclosure";
import {useRouter} from "next/navigation";
import {File as FileIcon} from "@geist-ui/icons";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

const schema = yup
    .object({
        name: yup.string().required(),
        file: yup.mixed().required(),
    })
    .required();

export default function NewFile(props: UseDisclosureProps & { parentId: string | null }) {
    const router = useRouter();

    const {
        register,
        setValue,
        setError,
        handleSubmit,
        reset,
        watch,
        clearErrors,
        formState: {errors, isSubmitting, isDirty, isValid}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            file: undefined,
        }
    });
    const {onChange, ...rest} = register("file");

    const isFileSelected = watch("file")
    const name = watch("name")

    const onSubmit = handleSubmit((data) => {
        if (!data.file) {
            setError("root.random", {
                message: "please select a file",
                type: "random",
            })
            return;
        }
        let formURL = `/api/files/${props.parentId ?? ''}`;
        const formData = new FormData();
        formData.set('name', data.name);
        // @ts-ignore
        formData.set('file', data.file![0]);

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
                    message: "an error occurred while uploading the file",
                    type: "random",
                })
            }
        }).catch((err) => {
            console.error(err);
        })
    });

    React.useEffect(() => {
        if (props.isOpen || props.onClose) {
            reset({name: "", file: undefined})
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
                            <ModalHeader className="flex flex-col gap-1">Upload a file</ModalHeader>
                            <ModalBody>
                                {errors.root?.random && <p className={"text-rose-600"}>{errors.root?.random.message}</p>}
                                <Input
                                    type={"file"}
                                    label="File"
                                    placeholder="Select a file"
                                    variant="bordered"
                                    id={"file_upload"}
                                    className={"sr-only"}
                                    {...rest}
                                    onChange={async (e)=>{
                                        await onChange(e);
                                        await setValue("name", e.target?.files![0]?.name)
                                    }}
                                />
                                <label
                                    className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-unit-4 min-w-unit-20 h-unit-10 text-small gap-unit-2 [&>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors motion-reduce:transition-none text-default-foreground bg-white border shadow rounded-lg hover:cursor-pointer"
                                    htmlFor={"file_upload"}>
                                    {isFileSelected ? name : "Select a file"}
                                </label>
                                {errors.file && <p role="alert">{errors.file.message}</p>}
                                {isFileSelected && (
                                    <Input
                                        autoFocus
                                        endContent={
                                            <FileIcon size={24} className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                                        }
                                        label="Name"
                                        placeholder="Enter your file name"
                                        variant="bordered"
                                        {...register("name")}
                                    />
                                )}
                                {errors.name && <p className={"text-rose-600"}>{errors.name.message}</p>}
                            </ModalBody>
                            <ModalFooter>
                                <Button type={"submit"} className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"} disabled={!isDirty || !isValid}  isLoading={isSubmitting}>
                                    Upload
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
