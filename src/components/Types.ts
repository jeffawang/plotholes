export type UniformControl = UniformSlider | UniformRadio | UniformGroup
export type UniformControls = {
    [key: string]: UniformControl
}

export type UniformSlider = {
    type: "slider",
    value: number,
    min?: number,
    max?: number,
    step?: number
}

export type UniformRadio = {
    type: "radio",
    value: string,
    options: string[],
    description?: string,
}

export type UniformGroup = {
    type: "group",
    value: UniformControls
}
