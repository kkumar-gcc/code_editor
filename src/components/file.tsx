"use client"
import {Editor} from "@/lib/editor";
import React from "react";
import {Button} from "@nextui-org/react";
import {useRouter} from "next/navigation";
import {Download, Copy, Check} from "@/components/geist-ui/icons";
import Renderer from "@/lib/file/renderer";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

const schema = yup
    .object({
        name: yup.string().required(),
        content: yup.string(),
    })
    .required();

export default function File({file, settings}: { file: any, settings: any }) {
    const [readOnly, setReadOnly] = React.useState(true);
    const [isCopied, setIsCopied] = React.useState(false);
    const router = useRouter();
    const {
        watch,
        setValue,
        setError,
        handleSubmit,
        reset,
        clearErrors,
        formState: {errors, isSubmitSuccessful, isSubmitting, isDirty, isValid}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: file?.name as string,
            content: file.content as string,
        }
    });

    const content = watch("content");

    const onSubmit = handleSubmit((data) => {
        let formURL = `/api/files/${file.id}`;

        fetch(formURL, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            if (res.status === 200) {
                setReadOnly(true)
                router.refresh();
            } else {
                setError("root.random", {
                    message: "an error occurred while saving the file.",
                    type: "random",
                })
            }
        }).catch((err) => {
            console.error(err);
        })
    })

    function onChange(value: string) {
        setValue("content", value, {shouldValidate: true, shouldDirty: true})
    }

    function handleDownload(file: any) {
        const link = document.createElement('a');
        link.download = file.name;

        link.href = file.url;

        link.click();
    }

    const fileRenderer = new Renderer(file);

    function handleCopyToClipboard() {
        navigator.clipboard.writeText(content as string)
            .then(() => {
                setIsCopied(true);

                // Reset isCopied state to false after 5 seconds
                setTimeout(() => {
                    setIsCopied(false);
                }, 2000);
            })
            .catch((error) => {
                console.error("Error copying to clipboard:", error);
            });
    }

    React.useEffect(() => {
        if (isSubmitSuccessful && (file)) {
            reset({
                name: file?.name as string,
                content: file.content as string,
            })
            clearErrors()
        }
    }, [clearErrors, isSubmitSuccessful, reset, file])

    return <div className={"py-6"}>
        {errors.root?.random && <p role="alert" className={"text-rose-600"}>{errors.root?.random.message}</p>}
        <div
            className={"flex flex-row bg-gray-50 border-1 rounded-t-lg mt-4 p-2 border-gray-400 border-b-0 items-center sticky overflow-x-scroll"}>
            <div className={"mr-5"}>
                <p>{file.name}</p>
            </div>
            <div className={"flex-1 flex justify-end flex-row"}>
                {fileRenderer.determineType() === "text" ?
                    <Button className={"h-8 bg-white border min-w-unit-12 shadow rounded-lg mr-2"} onClick={handleCopyToClipboard} disabled={isCopied}>
                        {isCopied ? <Check size={"lg"}/> : <Copy size={"lg"}/>}
                    </Button>
                    : null
                }
                <Button className={"h-8 bg-white border min-w-unit-12 shadow rounded-lg mr-2"}
                        onPress={() => handleDownload(file)}><Download size={"lg"}/></Button>
                {fileRenderer.determineType() === "text" ? (readOnly ?
                    <Button className={"h-8 bg-white border min-w-unit-12 shadow rounded-lg"}
                            onPress={() => setReadOnly(false)}>edit</Button>
                    :
                    <form onSubmit={onSubmit} className={"flex flex-row"}>
                        <Button type={"submit"}
                                className={"h-8 bg-rose-600 min-w-unit-12 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400 mr-2"}
                                disabled={!isDirty||!isValid} isLoading={isSubmitting}>save</Button>
                        <Button className={"h-8 bg-white border min-w-unit-12 shadow rounded-lg"}
                                onPress={() => setReadOnly(true)}>cancel</Button>
                    </form>)
                    : null
                }
            </div>
        </div>
        {fileRenderer.determineType() !== "text" ?
            fileRenderer.render()
            : <Editor value={file.content} className={"rounded-b-lg"} onChange={onChange} readOnly={readOnly} language={fileRenderer.determineLanguage()} fontSize={settings?.fontSize} fontWeight={settings?.fontWeight} fontFamily={settings?.fontFamily}/>
        }
    </div>
}
