import RenderImage from "@/lib/file/widgets/image";
import RenderVideo from "@/lib/file/widgets/video";
import RenderAudio from "@/lib/file/widgets/audio";
import RenderUnknown from "@/lib/file/widgets/unknown";
import RenderApplication from "@/lib/file/widgets/application";

class Renderer {
    private readonly file: any;

    constructor(file: any) {
        this.file = file;
    }

    public determineType() {
        const type = this.file.mimeType;
        if (type.startsWith("image")) {
            return "image";
        } else if (type.startsWith("video")) {
            return "video";
        } else if (type.startsWith("audio")) {
            return "audio";
        } else if (type.startsWith("text")) {
            return "text";
        } else if (type.startsWith("application")) {
            return "application";
        } else {
            return "unknown";
        }
    }

    public determineLanguage() {
    }

    public render() {
        const fileType = this.determineType();

        switch (fileType) {
            case "image":
                return this.image();
            case "video":
                return this.video();
            case "audio":
                return this.audio();
            case "text":
                return this.text();
            case "application":
                return this.application();
            default:
                return this.unknown();
        }
    }

    public image() {
        return <RenderImage file={this.file}/>;
    }

    public video() {
        return <RenderVideo file={this.file}/>;
    }

    public audio() {
        return <RenderAudio file={this.file}/>;
    }

    public text() {
        // we don't need this because we will use the editor
        return <></>
    }

    public application() {
        return <RenderApplication file={this.file} />
    }

    public unknown() {
        return <RenderUnknown file={this.file}/>;
    }
}

export default Renderer;
