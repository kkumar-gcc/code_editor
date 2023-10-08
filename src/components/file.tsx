"use client"
import {Editor} from "@/lib/editor";
import React from "react";
import {Button, ButtonGroup} from "@nextui-org/react";
import {Edit2} from "@/components/geist-ui/icons";

export default function File({file}: { file: any }) {
    const [readOnly, setReadOnly] = React.useState(true);
    function onMount() {
        console.log("mounted successfully")
    }

    function onChange(value: string) {
        console.log("file function",value)
    }

    function handleChange(){
    setReadOnly(!readOnly)
    }
    return <div className={"py-6"}>
        <div
            className={"flex flex-row bg-gray-50 border-1 rounded-t-lg mt-4 p-2 border-gray-800 border-b-0 items-center"}>
            <div>
                <p>{file.name}</p>
            </div>
            <div className={"flex-1 flex justify-end"}>
                <ButtonGroup className={"shadow border-none rounded-xl text-sm h-unit-8"}>
                    <Button
                        className={"px-1 py-1.5 h-8 bg-gray-50 min-w-unit-12 border border-gray-600"} onClick={()=>handleChange()}><Edit2/></Button>
                    <Button className={"px-1 py-1.5 h-8 bg-gray-50 min-w-unit-12 border border-gray-600"}>Two</Button>
                </ButtonGroup>
            </div>
        </div>
        <Editor value={file.content} className={"rounded-b-lg"} onMount={onMount} onChange={onChange}/>
    </div>
}
