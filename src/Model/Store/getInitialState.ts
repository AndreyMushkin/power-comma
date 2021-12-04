import {Editor} from "../Types/Editor";
import {App} from "../Types/App";
import {Presentation} from "../Types/Presentation";
import {Slide} from "../Types/Slide";
import {generate} from "../Utils/generate";
import {History} from "../Types/History";
import {CombinedState} from "redux";

export function getInitialAppState(): any {
    return {
        history: getInitialHistoryState(),
        data: getInitialEditorState()
    }
}

export function getInitialHistoryState(): History {
    return {
        past: null,
        future: null
    }
}

export function getInitialEditorState(): Editor {
    return {
        presentation: getInitialPresentationState(),
        selectedSlideIds: [],
        selectedElementIds: [],
        currentSlideId: null
    }
}

export function getInitialPresentationState(): Presentation {
    return {
        fileName: null,
        title: 'New Presentation',
        slides: [getInitialSlideState()]
    }
}

export function getInitialSlideState(): Slide {
    return {
        id: generate(),
        title: 'New Slide',
        elements: [],
        background: {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 0
        },
    }
}
