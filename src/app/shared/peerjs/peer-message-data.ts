import { PeerMessageDataType } from "./peer-message-data-type";

export class PeerMessageData {
    type: PeerMessageDataType;
    content: string;

    constructor(type: PeerMessageDataType, content: string = '') {
        this.type = type;
        this.content = content;
    }
}
