export default function RenderImage({file}: { file: any }) {
    return <div className={"m-2 border-gray-400 border rounded-b-lg p-4"}>
        <img src={file.url} alt={file.name} className={"max-w-full max-h-fit"} />
    </div>
}