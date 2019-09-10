let blocks = {};

let styles = [
    {
        name: 'Size',
        open: true,
        buildProps: [
            'width',
            'height',
            'min-width',
            'min-height',
            'max-width',
            'max-height',
            'display',
        ],
    },
    {
        name: 'Typography',
        open: false,
        buildProps: [
            'font-size',
            'font-family',
            'text-align',
            'font-weight',
            'color',
            'letter-spacing',
            'line-height',
            'text-decoration',
            'text-shadow',
        ],
        properties: [
            { name: 'Font', property: 'font-family' },
            { name: 'Weight', property: 'font-weight' },
            {
                property: 'text-decoration',
                name: 'Decoration',
                type: 'radio',
                defaults: 'none',
                list: [
                    { value: 'none', name: 'None', className: 'fa fa-times' },
                    {
                        value: 'underline',
                        name: 'underline',
                        className: 'fa fa-underline',
                    },
                    {
                        value: 'line-through',
                        name: 'Line-through',
                        className: 'fa fa-strikethrough',
                    },
                ],
            },
            {
                property: 'text-shadow',
                name: 'Text Shadow',
                properties: [
                    { name: 'X position', property: 'text-shadow-h' },
                    { name: 'Y position', property: 'text-shadow-v' },
                    { name: 'Blur', property: 'text-shadow-blur' },
                    { name: 'Color', property: 'text-shadow-color' },
                ],
            },
        ],
    },
    {
        name: 'Margin & Padding',
        open: false,
        buildProps: ['margin', 'padding'],
        properties: [
            {
                name: 'Margin',
                property: 'margin',
                properties: [
                    { name: 'Top', property: 'margin-top' },
                    { name: 'Left', property: 'margin-left' },
                    { name: 'Bottom', property: 'margin-bottom' },
                    { name: 'Right', property: 'margin-right' },
                ],
            },
            {
                name: 'Padding',
                property: 'padding',
                properties: [
                    { name: 'Top', property: 'padding-top' },
                    { name: 'Left', property: 'padding-left' },
                    { name: 'Bottom', property: 'padding-bottom' },
                    { name: 'Right', property: 'padding-right' },
                ],
            },
        ],
    },
    {
        name: 'Position',
        open: false,
        buildProps: ['float', 'position', 'top', 'left', 'bottom', 'right'],
    },
    {
        name: 'Border',
        open: false,
        buildProps: ['border', 'border-radius'],
        properties: [
            {
                property: 'border',
                name: 'Border',
                properties: [
                    { name: 'Width', property: 'border-width' },
                    { name: 'Style', property: 'border-style' },
                    { name: 'Color', property: 'border-color' },
                ],
            },
            {
                property: 'border-radius',
                name: 'Border Radius',
                properties: [
                    { name: 'Top', property: 'border-top-left-radius' },
                    { name: 'Right', property: 'border-top-right-radius' },
                    { name: 'Bottom', property: 'border-bottom-left-radius' },
                    { name: 'Left', property: 'border-bottom-right-radius' },
                ],
            },
        ],
    },
    {
        name: 'Background',
        open: false,
        buildProps: ['opacity', 'background-color', 'box-shadow', 'background'],
        properties: [
            {
                type: 'slider',
                property: 'opacity',
                defaults: 1,
                step: 0.01,
                max: 1,
                min: 0,
            },
            {
                property: 'background',
                properties: [
                    { name: 'Image', property: 'background-image' },
                    { name: 'Repeat', property: 'background-repeat' },
                    { name: 'Position', property: 'background-position' },
                    { name: 'Attachment', property: 'background-attachment' },
                    { name: 'Size', property: 'background-size' },
                ],
            },
        ],
    },
    {
        name: 'Extra',
        open: false,
        buildProps: ['transition', 'perspective', 'transform'],
        properties: [
            {
                property: 'transition',
                properties: [
                    { name: 'Property', property: 'transition-property' },
                    { name: 'Duration', property: 'transition-duration' },
                    { name: 'Easing', property: 'transition-timing-function' },
                ],
            },
            {
                property: 'transform',
                properties: [
                    { name: 'Rotate X', property: 'transform-rotate-x' },
                    { name: 'Rotate Y', property: 'transform-rotate-y' },
                    { name: 'Rotate Z', property: 'transform-rotate-z' },
                    { name: 'Scale X', property: 'transform-scale-x' },
                    { name: 'Scale Y', property: 'transform-scale-y' },
                    { name: 'Scale Z', property: 'transform-scale-z' },
                ],
            },
        ],
    },
];
let traits = {};

export {
    blocks as betterialBlock,
    styles as betterialStyles,
    traits as betterialTraits,
};
