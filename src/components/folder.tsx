"use client"

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Table,
    DropdownTrigger, TableBody, TableCell,
    TableColumn,
    TableHeader, TableRow, useDisclosure
} from "@nextui-org/react";
import React from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import { File as FileIcon, Folder as FolderIcon, MoreHorizontal, Plus, Trash2, Edit } from '@/components/geist-ui/icons';
import NewFolder from "@/components/folders/new";
import { useRouter } from 'next/navigation'
import NewFile from "@/components/files/new";
import EditFolder from "@/components/folders/edit";
import EditFile from "@/components/files/edit";

export default function Folder({folders, files}:{folders: any, files: any}) {
    const router = useRouter()
    const newFolder = useDisclosure();
    const newFile = useDisclosure();
    const editFolder = useDisclosure();
    const editFile = useDisclosure();
    const [file, setFile] = React.useState(null);
    const [folder, setFolder] = React.useState(null);
    function triggerAction(key: any) {
        alert(key)
    }

    async function handleEditFolder (folder: any){
        setFolder(folder)
        editFolder.onOpen()
    }

    function handleEditFile(file: any) {
        setFile(file);
        editFile.onOpen()
    }

    return <div>
        <div className={"flex flex-row items-center mb-4"}>
            <h3 className={"font-normal"}>My Files</h3>
            <div className={"flex-1 flex justify-end"}>
                <Dropdown>
                    <DropdownTrigger>
                        <Button className={"bg-white border shadow rounded-lg"} startContent={<Plus/>}>Add New</Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Example with disabled actions" variant="faded" disabledKeys={["edit", "delete"]}>
                        <DropdownItem key="new_folder" startContent={<FolderIcon size={18}/> } onPress={newFolder.onOpen} >
                            New Folder
                        </DropdownItem>
                        <DropdownItem key="new_file" startContent={<FileIcon size={18}/>} onPress={newFile.onOpen}>New file</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
        <Table
            color={"default"}
            aria-label="Example static collection table"
        >
            <TableHeader>
                <TableColumn><FileIcon/></TableColumn>
                <TableColumn>NAME</TableColumn>
                <TableColumn>MODIFIED</TableColumn>
                <TableColumn>FILE SIZE</TableColumn>
                <TableColumn>ACTION</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No rows to display."} >
                    {folders.map((folder: any, index: number) => (
                        <TableRow key={`folder-${index}`}>
                            <TableCell><FolderIcon/></TableCell>
                            <TableCell><Link href={`/folders/${folder.id}`}>{folder.name}</Link></TableCell>
                            <TableCell>{DateTime.local(folder.updatedAt).toLocaleString(DateTime.DATE_FULL)}</TableCell>
                            <TableCell>{folder.size}</TableCell>
                            <TableCell>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button className={"bg-white border-none shadow-none rounded-lg"} startContent={<MoreHorizontal/>}></Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Example with disabled actions" variant="faded">
                                    <DropdownItem key="edit_folder" startContent={<Edit size={18}/> } onPress={()=>handleEditFolder(folder)} >
                                        Edit folder
                                    </DropdownItem>
                                    <DropdownItem className={"text-red-600"} key="delete_folder" color={"danger"} startContent={<Trash2 size={18}/>} onPress={newFile.onOpen}>Delete folder</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            </TableCell>
                        </TableRow>
                    ))}
                    {files.map((file: any, index: number) => (
                        <TableRow key={`file-${index}`}>
                            <TableCell><FileIcon/></TableCell>
                            <TableCell><Link href={`/files/${file.id}`}>{file.name}</Link></TableCell>
                            <TableCell>{DateTime.local(file.updatedAt).toLocaleString(DateTime.DATE_FULL)}</TableCell>
                            <TableCell>{file.size}</TableCell>
                            <TableCell>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button className={"bg-white border-none shadow-none rounded-lg"} startContent={<MoreHorizontal/>}></Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Example with disabled actions" variant="faded" disabledKeys={["edit", "delete"]}>
                                    <DropdownItem key="edit_file" startContent={<Edit size={18}/> } onPress={()=>handleEditFile(file)} >
                                        Edit file
                                    </DropdownItem>
                                    <DropdownItem className={"text-red-600"} key="delete_file" startContent={<Trash2 size={18}/>} onPress={newFile.onOpen}>Delete file</DropdownItem>
                                </DropdownMenu>
                            </Dropdown></TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>

        {/* Models for this page */}
        <NewFolder isOpen={newFolder.isOpen} onClose={newFolder.onClose} onOpen={newFolder.onOpen} publicId={null} />
        <NewFile isOpen={newFile.isOpen} onClose={newFile.onClose} onOpen={newFile.onOpen} publicId={null}/>
        <EditFile isOpen={editFile.isOpen} onClose={editFile.onClose} onOpen={editFile.onOpen} file={file}/>
        <EditFolder isOpen={editFolder.isOpen} onClose={editFolder.onClose} onOpen={editFolder.onOpen} folder={folder} />
    </div>
}