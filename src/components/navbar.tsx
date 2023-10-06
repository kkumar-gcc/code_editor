"use client"
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Avatar, Spinner} from "@nextui-org/react";
import {signOut, useSession} from "next-auth/react";
import React from "react";

export default function Navbar() {
    const { data, status } = useSession()

    return (
        <nav className="bg-skin-base border-b border-gray-100 z-10 border-t w-full py-4 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row items-center">
                <div className="mr-4">
                    <a href="/" className="navbar-item">
                        CODE IDE
                    </a>
                </div>
                <div className="flex-1 flex justify-end">
                    {status === "loading"?
                        <Spinner color="default" labelColor="foreground"/> :
                        <Dropdown >
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
                        <DropdownMenu aria-label="Example with disabled actions" variant="faded" disabledKeys={["setting"]}>
                            <DropdownItem key="setting">Settings</DropdownItem>
                            <DropdownItem key="sign_out" className="text-danger" color="danger" onClick={()=> signOut()}>
                                Sign Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    }
                </div>
            </div>
        </nav>
    );
}