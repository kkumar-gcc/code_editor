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
import {useRouter} from "next/navigation";
import {File as FileIcon} from "@geist-ui/icons";
import {useCustomForm} from "@/hooks/useCustomForm";
import {CustomError} from "@/types/customError";

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
                                {errors.map((error, index) => (
                                    <p key={index}>
                                        {error.message}
                                    </p>
                                ))}
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
                                    className="bg-skin-base  capatalize py-2 px-4 leading-6  border inline-flex flex-row justify-center items-center no-underline rounded-md font-semibold cursor-pointer transition duration-200 ease-in-out shadow-sm shadow-gray-100"
                                    htmlFor={"file_upload"}>
                                    change
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
