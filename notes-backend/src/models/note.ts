export class Note {
    id: string;
    title: string;
    content: string;
    timestamp: Date;

    constructor(id: string, title: string, content: string, timestamp: Date) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.timestamp = timestamp;
    }
}