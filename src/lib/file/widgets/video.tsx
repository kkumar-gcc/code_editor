
export default function RenderVideo({file}: { file: any }) {
    return <div className={"m-2 border-gray-400 border rounded-b-lg p-4"}>
        <video controls>
            <source src={file.url} type={file.type}/>
            Your browser does not support the video element.
        </video>
    </div>
}