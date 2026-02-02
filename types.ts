export interface Project {
    id: string;
    label: string;
    img: string;
    text: string;
    fullText?: string;
    secondaryImg?: string;
}

export interface ConnectionMap {
    [key: string]: string[];
}

export interface TopicConnection {
    source: string;
    target: string;
}

export interface NodeData {
    id: string;
    label: string;
    type: 'anchor' | 'project' | 'topic';
}

export enum ChatRole {
    USER = 'user',
    MODEL = 'model'
}

export interface ChatMessage {
    role: ChatRole;
    text: string;
}