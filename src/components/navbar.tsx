"use client"
import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Spinner,
    useDisclosure
} from "@nextui-org/react";
import {signOut, useSession} from "next-auth/react";
import React from "react";
import Setting from "@/components/setting";

export default function Navbar(props: { settings: any | null }) {
    const {data, status} = useSession()
    const settingModal = useDisclosure();
    return (
        <nav className="bg-skin-base border-b border-gray-100 z-10 border-t w-full py-4 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row items-center">
                <div className="mr-4">
                    <a href="/folders" className="navbar-item">
                        <b>
                            <i style={{letterSpacing: '0.6px'}}>
                                <span className="text-indigo-500">C</span>
                                <span className="text-pink-500">O</span>
                                <span className="text-purple-500">D</span>
                                <span className="text-teal-500">E</span>
                                <span className="ml-1.5">IDE</span>
                            </i>
                        </b>
                    </a>
                </div>
                <div className="flex-1 flex justify-end">
                    {status === "loading" ?
                        <Spinner color="default" labelColor="foreground"/> :
                        <Dropdown>
                            <DropdownTrigger>
                                {data?.user?.image ? (
                                    <Avatar
                                        size={"md"}
                                        isBordered
                                        radius="full"
                                        src={data.user.image}
                                    />
                                ) : (
                                    <Button className={"bg-white border shadow rounded-lg"}>Login</Button> // You can replace this with your login button component
                                )}
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Example with disabled actions" variant="faded">
                                <DropdownItem key="setting" onClick={settingModal.onOpen}>Settings</DropdownItem>
                                <DropdownItem key="sign_out" className="text-danger" color="danger"
                                              onClick={() => signOut()}>
                                    Sign Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    }
                </div>
            </div>
            <Setting isOpen={settingModal.isOpen} onClose={settingModal.onClose} settings={props.settings}/>
        </nav>
    );
}
