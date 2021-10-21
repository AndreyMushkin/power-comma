

type ColorType = {
    readonly red: number;
    readonly green: number;
    readonly blue: number;
}

type TextType = {
    readonly color: ColorType;
    readonly font: string;
    readonly content: string;
}

type BorderType = {
    readonly isBordered: boolean;
    readonly width: number;
    readonly color: ColorType;
}

type FillType = {
    readonly isFill: boolean;
    readonly color: ColorType;
}

type CommonType = {
    readonly x1, y1: number;
    readonly border: BorderType;
    readonly fill: FillType;
    readonly Id: number;
}

type TextBoxType = CommonType & {
    readonly x2, y2: number;
    readonly content: TextType;
}

type PictureType = CommonType & {
    readonly h, w: number;
    readonly src: string;
}

type CircleType = CommonType & {
    readonly r: number;
}

type TriangleType = CommonType & {
    readonly h, w: number;
}

type Rectangle = {
    readonly x2, y2: number;
}

type TypeType = {
    readonly name: string;
}

type ElementType = Rectangle | TriangleType | CircleType | PictureType | TextBoxType & {
    readonly type: TypeType;
};

type SlideType = {
    //readonly titel: TextType;
    readonly elements: Array<ElementType>;
    readonly background: PictureType | ColorType;
    readonly Id: number;
}

type PresentationType = {
    readonly title: string;
    readonly slider: Array<SlideType>;
}
type HistoryType = {
    readonly functionName: string;
    readonly params: Array<String>;
    readonly paramsCount: number;
}

type EditorType = {
    readonly presentation: PresentationType;
    readonly activeSlide: Array<number>;
    readonly activeElements: Array<number>;
    readonly openSlide: number;
    readonly history: HistoryType;
}

