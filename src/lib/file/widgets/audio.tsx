
export default function RenderAudio({file}: { file: any }) {
    return <div className={"m-2 border-gray-400 border rounded-b-lg p-4"}>
        <audio controls>
            <source src={file.url} type={file.type}/>
            Your browser does not support the audio element.
        </audio>
    </div>
}