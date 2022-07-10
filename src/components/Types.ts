export type UniformControl = UniformSlider | UniformNumber | UniformRadio | UniformCheckbox | UniformGroup;
export type UniformControls = {
    [key: string]: UniformControl
};

export const slider = "slider" as const;
export const _number = "number" as const;
export const radio = "radio" as const;
export const checkbox = "checkbox" as const;
export const group = "group" as const;

export type UniformSlider = {
    type: "slider"
    value: number
    min?: number
    max?: number
    step?: number
};

export type UniformNumber = {
    type: "number"
    value: number
    min?: number
    max?: number
    step?: number
};

export type UniformRadio = {
    type: "radio"
    value: string
    options: string[]
    description?: string
};

export type UniformCheckbox = {
    type: "checkbox"
    value: boolean
};

export type UniformGroup = {
    type: "group",
    value: UniformControls
};
