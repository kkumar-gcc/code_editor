"use client"
import React from "react";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {UseDisclosureProps} from "@nextui-org/use-disclosure";
import {useRouter} from "next/navigation";
import {File as FileIcon} from "@geist-ui/icons";
import {useCustomForm} from "@/hooks/useCustomForm";
import {CustomError} from "@/types/customError";
import Errors from "@/components/errors";

export default function NewFile(props: UseDisclosureProps & { parentId: string | null }) {
    const router = useRouter();

    const { state, setState, errors, isSubmitting, isDisabled, setIsDisabled, handleSubmit, resetForm } = useCustomForm(
        {
            name: "",
            file: null,
        },
        async (formData, setError) => {
            if (!formData.file) {
                return;
            }
            let formURL = `/api/files/${props.parentId ?? ''}`;

            const data = new FormData();
            data.set('name', formData.name);
            data.set('file', formData.file);

            const res = await fetch(formURL, {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                // @ts-ignore
                props.onClose();
                router.refresh();
            } else {
                setError(new CustomError("An error occurred while uploading the file."));
            }
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
        if (e.target.type === "file" && e.target.files) {
            const file = e.target.files[0];
            setState({
                ...state,
                [e.target.name]: file,
                ["name"]: file?.name,
            });
            return;
        }
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    }

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
                            <ModalHeader className="flex flex-col gap-1">Upload a file</ModalHeader>
                            <ModalBody>
                                <Errors errors={errors} />
                                <Input
                                    type={"file"}
                                    label="File"
                                    placeholder="Select a file"
                                    variant="bordered"
                                    name="file"
                                    id={"file_upload"}
                                    className={"sr-only"}
                                    onChange={handleChange}
                                />
                                <label
                                    className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-unit-4 min-w-unit-20 h-unit-10 text-small gap-unit-2 [&>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors motion-reduce:transition-none text-default-foreground bg-white border shadow rounded-lg hover:cursor-pointer"
                                    htmlFor={"file_upload"}>
                                    {state.file ? state.name : "Select a file"}
                                </label>
                                {state.file && (
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
                                    )}
                            </ModalBody>
                            <ModalFooter>
                                <Button type={"submit"} className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"} disabled={isDisabled} isLoading={isSubmitting}>
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
