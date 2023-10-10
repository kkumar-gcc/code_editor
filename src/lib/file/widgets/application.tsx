export default function RenderApplication({file}: { file: any }) {
    return <div className={"m-2 border-gray-400 border rounded-b-lg p-4"}>
        <embed
            src={file.url}
            type={file.mimeType}
            className="w-full min-h-max"
            title={file.name}
        />
    </div>
}
