"use client"

import {UseDisclosureProps} from "@nextui-org/use-disclosure";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem
} from "@nextui-org/react";
import React from "react";
import {useCustomForm} from "@/hooks/useCustomForm";
import {CustomError} from "@/types/customError";
import {useRouter} from "next/navigation";

export default function Setting(props: UseDisclosureProps & { settings: any | null }) {
    const router = useRouter();

    const fontSizes = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "30", "36", "48", "60", "72", "96"];
    const fontWeights = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
    const fontFamilies = [
        "sans-serif",
        "serif",
        "monospace",
        "cursive",
        "fantasy",
        "system-ui",
        "ui-serif",
        "ui-sans-serif",
        "ui-monospace",
        "ui-rounded",
        "emoji",
        "math",
        "fangsong"
    ];

    const {
        state,
        isSubmitting,
        isDisabled,
        handleChange,
        handleSubmit
    } = useCustomForm({
        fontSize: props?.settings?.fontSize||"14",
        fontFamily: props?.settings?.fontFamily||"sans-serif",
        fontWeight: props?.settings?.fontWeight||"400",
    }, async (formData, setError) => {
        let formURL = `/api/settings`;

        const res = await fetch(formURL, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.status === 200) {
            // @ts-ignore
            props.onClose();
            router.refresh();
        } else {
            setError(new CustomError("An error occurred while updating settings."));
        }
    });

    return (
        <>
            <Modal backdrop="blur" size={"2xl"} isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
                                <ModalBody>
                                    <div>
                                        <h3 className="text-normal leading-6 font-medium text-gray-900">Editor Settings</h3>
                                        <div className={"flex flex-col sm:flex-row"}>
                                            <Select
                                                selectionMode={"single"}
                                                variant={"bordered"}
                                                label="font size"
                                                className={"mt-2"}
                                                name={"fontSize"}
                                                value={state.fontSize}
                                                onChange={handleChange}
                                                selectedKeys={new Set([state.fontSize])}
                                            >
                                                {fontSizes.map((size)=> (
                                                    <SelectItem key={size} value={size} textValue={size.toString()}>
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Select
                                                selectionMode={"single"}
                                                variant={"bordered"}
                                                label="font weight"
                                                className={"sm:ml-2 mt-2"}
                                                name={"fontWeight"}
                                                value={state.fontWeight}
                                                onChange={handleChange}
                                                selectedKeys={new Set([state.fontWeight])}
                                            >
                                                {fontWeights.map((weight)=> (
                                                    <SelectItem key={weight} value={weight} textValue={weight.toString()}>
                                                        {weight}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className={"flex flex-col sm:flex-row"}>
                                            <Select
                                                selectionMode={"single"}
                                                variant={"bordered"}
                                                label="font family"
                                                className={"mt-2"}
                                                name={"fontFamily"}
                                                value={state.fontFamily}
                                                onChange={handleChange}
                                                selectedKeys={new Set([state.fontFamily])}
                                            >
                                                {fontFamilies.map((family)=>(
                                                    <SelectItem key={family} value={family} textValue={family}>
                                                        {family}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type={"submit"} className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"} disabled={isDisabled} isLoading={isSubmitting}>
                                        Save settings
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
    )
}