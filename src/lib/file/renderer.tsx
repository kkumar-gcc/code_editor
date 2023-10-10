import RenderImage from "@/lib/file/widgets/image";
import RenderVideo from "@/lib/file/widgets/video";
import RenderAudio from "@/lib/file/widgets/audio";
import RenderUnknown from "@/lib/file/widgets/unknown";
import RenderApplication from "@/lib/file/widgets/application";

class Renderer {
    private readonly file: any;
    private editable = ["application/json", "application/xml", "application/javascript", "application/xhtml+xml", "application/sql", "application/yaml", "application/x-yaml", "application/csv", "application/x-csv", "application/x-sh", "application/xml-dtd", "application/x-httpd-php", "application/x-latex", "application/x-python", "application/x-perl", "application/postscript", "application/x-tex", "application/ld+json", "application/rss+xml", "application/soap+xml"];
    // we add more types to support preview
    private embeddableApplications = ["application/pdf"]

    constructor(file: any) {
        this.file = file;
    }

    private isApplication(mimeType: string) {
        return this.embeddableApplications.includes(mimeType);
    }

    private isAudio(mimeType: string) {
        return mimeType.startsWith("audio");
    }

    private isImage(mimeType: string) {
        return mimeType.startsWith("image");
    }

    private isText(mimeType: string) {
        return this.editable.includes(mimeType) || mimeType.startsWith("text");
    }

    private isVideo(mimeType: string) {
        return mimeType.startsWith("video");
    }


    public determineType() {
        const type = this.file.mimeType;
        if (this.isImage(type)) {
            return "image";
        } else if (this.isVideo(type)) {
            return "video";
        } else if (this.isAudio(type)) {
            return "audio";
        } else if (this.isText(type)) {
            return "text";
        } else if (this.isApplication(type)) {
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
