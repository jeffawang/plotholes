export type Uniform = SliderUniform | RadioUniform | GroupUniform
export type Uniforms = {
    [key: string]: Uniform
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
    description?: string,
}

export type GroupUniform = {
    type: "group",
    children: Uniforms
}