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

export default function EditFolder(props: UseDisclosureProps & { folder: any | null }) {
    const router = useRouter();
    const [formData, setFormData] = React.useState({
        name: "",
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formURL = `/api/folders/${props.folder.id}`;

        try {
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
            }
        }catch (err) {
            console.error(err);
            setErrors({message:"An error occurred while editing the folder."});
        }finally {
            setIsSubmitting(false);
        }
    }

    // Use useEffect to reset folderId when the component is unmounted
    React.useEffect(() => {
        setFormData({
            name: props.folder?.name,
        });
        setIsDisabled(true);
        setIsSubmitting(false);
    }, [props.isOpen, props.folder]);

    return (
        <>
            <Modal backdrop="blur" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit} action={"/api/folders"}>
                                <ModalHeader className="flex flex-col gap-1">Edit the folder</ModalHeader>
                                <ModalBody>
                                    {errors.message && (
                                        <p className="mb-3 text-red-600">
                                            {errors.message}
                                        </p>
                                    )}
                                    <Input
                                        autoFocus
                                        endContent={
                                            <FolderIcon size={24} className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                                        }
                                        label="Name"
                                        placeholder="Enter your folder name"
                                        variant="bordered"
                                        name="name"
                                        value={formData.name}
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
