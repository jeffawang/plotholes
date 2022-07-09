export type SketchControl = SliderControl | RadioControl | GroupControl

export type GroupControl = {
    type: "group"
    name: string
    children: SketchControl[]
}

export type SliderControl = {
    type: "slider"
    name: string
    uniform: string
    defaultValue: number
    step?: number
    min?: number
    max?: number
}

export type RadioControl = {
    type: "radio"
    name: string
    description?: string
    defaultValue: string
    uniform: string
    options: {
        name: string
        value: string
    }[]
}

export type Uniforms = {
    [key: string]: SliderUniform | RadioUniform | GroupUniform
}

export type SliderUniform = {
    type: "slider",
    value: number,
    min?: number,
    max?: number,
    step?: number
}

export type RadioUniform = {
    type: "radio",
    value: string,
    options: string[],
}

export type GroupUniform = {
    type: "group",
    children: []
}