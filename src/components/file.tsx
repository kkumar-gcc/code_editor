"use client"
import {Editor} from "@/lib/editor";
import React from "react";
import {Button} from "@nextui-org/react";
import {useRouter} from "next/navigation";
import {useCustomForm} from "@/hooks/useCustomForm";
import {CustomError} from "@/types/customError";
import Errors from "@/components/errors";

export default function File({file}: { file: any }) {
    const [readOnly, setReadOnly] = React.useState(true);
    const router = useRouter();
    const {state, setState, errors, isSubmitting, isDisabled, setIsDisabled, handleSubmit, resetForm} = useCustomForm(
        {
            name: file?.name,
            content: file.content,
        },
        async (formData, setError) => {
            const formURL = `/api/files/${file.id}`;

            const res = await fetch(formURL, {
                method: "PATCH",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.status === 200) {
                setReadOnly(true)
                router.refresh();
            } else {
                setError(new CustomError("An error occurred while saving the file."));
            }
        }
    );

    function onChange(value: string) {
        if (value !== file.content) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
        setState({
            ...state,
            ["content"]: value,
        })
    }

    React.useEffect(() => {
        resetForm()
    }, [file]);

    return <div className={"py-6"}>
        <Errors errors={errors} />
        <div
            className={"flex flex-row bg-gray-50 border-1 rounded-t-lg mt-4 p-2 border-gray-400 border-b-0 items-center sticky"}>
            <div>
                <p>{file.name}</p>
            </div>
            <div className={"flex-1 flex justify-end"}>
                {readOnly ?
                    <Button className={"h-8 bg-white border min-w-unit-12 shadow rounded-lg"}
                            onPress={() => setReadOnly(false)}>edit</Button>
                    :
                    <form onSubmit={handleSubmit}>
                        <Button type={"submit"}
                                className={"h-8 bg-rose-600 min-w-unit-12 border shadow rounded-lg border-rose-800 text-white disabled:bg-rose-300 disabled:border-rose-400 mr-2"}
                                disabled={isDisabled} isLoading={isSubmitting}>save</Button>
                        <Button className={"h-8 bg-white border min-w-unit-12 shadow rounded-lg"}
                                onPress={() => setReadOnly(true)}>cancel</Button>
                    </form>
                }
            </div>
        </div>
        <Editor value={file.content} className={"rounded-b-lg"} onChange={onChange} readOnly={readOnly}/>
    </div>
}
