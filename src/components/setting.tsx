"use client"

import {UseDisclosureProps} from "@nextui-org/use-disclosure";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem} from "@nextui-org/react";
import React from "react";
import {useRouter} from "next/navigation";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

const schema = yup
    .object({
        fontSize: yup.string().required(),
        fontWeight: yup.string().required(),
        fontFamily: yup.string().required(),
    })
    .required();

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
        reset,
        clearErrors,
        register,
        watch,
        setError,
        handleSubmit,
        formState: {errors, isSubmitting, isDirty, isValid}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            fontSize: props.settings?.fontSize || "14",
            fontWeight: props.settings?.fontWeight || "400",
            fontFamily: props.settings?.fontFamily || "sans-serif",
        }
    });

    const onSubmit = handleSubmit((data) => {
        const formURL = `/api/settings`;

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
                    message: "an error occurred while updating settings",
                    type: "random",
                })
            }
        }).catch((err) => {
            console.error(err);
        })
    })

    const fontFamily = watch("fontFamily");
    const fontWeight = watch("fontWeight");
    const fontSize = watch("fontSize");

    React.useEffect(() => {
        if (props.isOpen && props.settings) {
            reset({
                fontSize: props.settings?.fontSize || "14",
                fontWeight: props.settings?.fontWeight || "400",
                fontFamily: props.settings?.fontFamily || "sans-serif",
            })
            clearErrors()
        }
    }, [clearErrors, reset, props])

    console.log(errors)
    return (
        <>
            <Modal backdrop="blur" size={"2xl"} isOpen={props.isOpen} onClose={props.onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={onSubmit}>
                                <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
                                <ModalBody>
                                    <div>
                                        {errors.root?.random && <p role="alert"
                                                                   className={"text-rose-600"}>{errors.root?.random.message}</p>}
                                        <h3 className="text-normal leading-6 font-medium text-gray-900">Editor
                                            Settings</h3>
                                        <div className={"flex flex-col sm:flex-row"}>
                                            <div className={"mt-2 flex-1"}>
                                                <Select
                                                    selectionMode={"single"}
                                                    variant={"bordered"}
                                                    label="font size"
                                                    {...register("fontSize")}
                                                    selectedKeys={new Set([fontSize])}
                                                >
                                                    {fontSizes.map((size) => (
                                                        <SelectItem key={size} value={size} textValue={size.toString()}>
                                                            {size}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                                {errors.fontSize && <p role="alert"
                                                                       className={"text-rose-600"}>{errors.fontSize.message as string}</p>}
                                            </div>
                                            <div className={"sm:ml-2 mt-2 flex-1"}>
                                                <Select
                                                    selectionMode={"single"}
                                                    variant={"bordered"}
                                                    label="font weight"
                                                    {...register("fontWeight")}
                                                    selectedKeys={new Set([fontWeight])}
                                                >
                                                    {fontWeights.map((weight) => (
                                                        <SelectItem key={weight} value={weight}
                                                                    textValue={weight.toString()}>
                                                            {weight}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                                {errors.fontWeight && <p role="alert"
                                                                         className={"text-rose-600"}>{errors.fontWeight.message as string}</p>}
                                            </div>
                                        </div>
                                        <div className={"flex flex-col"}>
                                            <Select
                                                selectionMode={"single"}
                                                variant={"bordered"}
                                                label="font family"
                                                className={"mt-2"}
                                                {...register("fontFamily")}
                                                selectedKeys={new Set([fontFamily])}
                                            >
                                                {fontFamilies.map((family) => (
                                                    <SelectItem key={family} value={family} textValue={family}>
                                                        {family}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            {errors.fontFamily && <p role="alert"
                                                                     className={"text-rose-600"}>{errors.fontFamily.message as string}</p>}
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type={"submit"}
                                            className={"bg-rose-600 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400"}
                                            disabled={!isValid || !isDirty} isLoading={isSubmitting}>
                                        Save settings
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
    )
}