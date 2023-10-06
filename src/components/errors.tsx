import {CustomError} from "@/types/customError";

export default function Errors({errors}: { errors: CustomError[] }) {
    return <>
        {errors.length === 0 ? null : <div className={"bg-rose-100 border border-rose-600 rounded-xl p-4"}>
            <ul className={"text-sm text-rose-600 list-disc ml-2"}>
                {errors.map((error, index) => (
                    <li key={index}>
                        {error.message}
                    </li>
                ))}
            </ul>
        </div>}
    </>
}