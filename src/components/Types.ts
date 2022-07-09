export type SketchControl = SliderControl | RadioControl | GroupControl

export type GroupControl = {
    type: "group"
    name: string
    children: SketchControl[]
}

export type SliderControl = {
    type: "slider"
    name: string
    field: string
    defaultValue: number
}

export type RadioControl = {
    type: "radio"
    name: string
    description?: string
    defaultValue: string
    field: string
    options: {
        name: string
        value: string
    }[]
}
