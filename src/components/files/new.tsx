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
import {Folder as FolderIcon} from "@geist-ui/icons";

export default function NewFile(props: UseDisclosureProps & { parentId: string | null }) {
    const router = useRouter();
    const [formData, setFormData] = React.useState({
        name: "",
        file: null,
    });

    const [errors , setErrors] = React.useState({} as any);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDisabled, setIsDisabled] = React.useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
        if (e.target.type === "file" && e.target.files) {
            const file = e.target.files[0];
            setFormData({
                ...formData,
                [e.target.name]: file,
                ["name"]: file?.name,
            });
            return;
        }
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!formData.file) {
            return;
        }
        let formURL = `/api/files/${props.parentId ?? ''}`;

        const data = new FormData();
        data.set('name', formData.name);
        data.set('file', formData.file);

        try {
            const res = await fetch(formURL, {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                // @ts-ignore
                props.onClose();
                router.refresh();
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setErrors({message:"An error occurred while uploading the file."});
        } finally {
            setIsSubmitting(false);
        }
    };


    React.useEffect(() => {
        setFormData({
            name: "",
            file: null,
        });
        setIsDisabled(true)
        setIsSubmitting(false)
        setErrors({})
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
                                {errors.message && (
                                    <p className="mb-3 text-red-600">
                                        {errors.message}
                                    </p>
                                )}
                                <Input
                                    type={"file"}
                                    label="File"
                                    placeholder="Select a file"
                                    variant="bordered"
                                    name="file"
                                    onChange={handleChange}
                                />
                                {formData.file && (
                                <Input
                                    autoFocus
                                    endContent={
                                        <FolderIcon size={24} className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                                    }
                                    label="Name"
                                    placeholder="Enter your file name"
                                    variant="bordered"
                                    name="name"
                                    value={formData.name}
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
