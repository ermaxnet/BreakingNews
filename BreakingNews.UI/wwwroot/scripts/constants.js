import React from "react";

export const COMPONENT_MODE = {
    VIEW: Symbol("component.mode.view"),
    BASE: Symbol("component.mode.base")
};

export const COMPONENT_TYPE = {
    BASE: Symbol("component.$base"),
    SIMPLE_TEXT: Symbol("component.$simple-text")
};

export const INLINE_STYLE = {
    BOLD: "BOLD",
    ITALIC: "ITALIC",
    UNDERLINE: "UNDERLINE",
    HIGHLIGHT: "HIGHLIGHT",
    HYPERLINK: "HYPERLINK",
    DANGER_TEXT: "DANGER_TEXT"
};

export const BLOCK_STYLE = {
    UNSTYLED: "unstyled",
    PARAGRAPH: "unstyled",
    H1: "header-one",
    H2: "header-two",
    H3: "header-three",
    H4: "header-four",
    BLOCKQUOTE: "blockquote",
    OL: "ordered-list-item",
    UL: "unordered-list-item",
    ATOMIC: "atomic",
    BLOCKQUOTE_CAPTION: "block-quote-caption",
    IMAGE: "atomic:image",
    IMAGES: "atomic:images"
};

export const ENTITY = {
    LINK: "LINK",
    IMAGE_CAPTION: "IMAGE_CAPTION",
    DANGER_TEXT: "DANGER_TEXT"
};

export const COMMANDS = {
    SAVE_CONTENT: "editor-save",
    LOAD_CONTENT: "load-saved-data",
    ADD_NEW_BLOCK: "add-new-block",
    SHOW_LINK_INPUT: "show-link-input",
    UNLINK: "unlink",
    DELETE_BLOCK: "delete-block",
    CHANGE_TYPE(type = "") {
        return `changetype:${type}`;
    },
    TOGGLE_INLINE_STYLE(style = "") {
        return `toggle-inline:${style}`;
    }
};

export const ARTICLE_CONTENT = "ARTICLE_CONTENT";

export const DQUOTE_START = "“";
export const DQUOTE_END = "”";
export const SQUOTE_START = "‘";
export const SQUOTE_END = "’";

export const INLINE_BUTTONS = [
    {
        style: INLINE_STYLE.BOLD,
        icon: "fa-bold",
        description: "toolbar.bold"
    },
    {
        style: INLINE_STYLE.ITALIC,
        icon: "fa-italic",
        description: "toolbar.italic",
    },
    {
        style: INLINE_STYLE.UNDERLINE,
        icon: "fa-underline",
        description: "toolbar.underline",
    },
    {
        style: INLINE_STYLE.HIGHLIGHT,
        icon: "fa-highlighter",
        description: "toolbar.highlight",
    },
    {
        label: (
            <svg width="20" height="15" viewBox="0 0 457.03 457.03">
                <g>
                    <path d="M421.512,207.074l-85.795,85.767c-47.352,47.38-124.169,47.38-171.529,0c-7.46-7.439-13.296-15.821-18.421-24.465
                        l39.864-39.861c1.895-1.911,4.235-3.006,6.471-4.296c2.756,9.416,7.567,18.33,14.972,25.736c23.648,23.667,62.128,23.634,85.762,0
                        l85.768-85.765c23.666-23.664,23.666-62.135,0-85.781c-23.635-23.646-62.105-23.646-85.768,0l-30.499,30.532
                        c-24.75-9.637-51.415-12.228-77.373-8.424l64.991-64.989c47.38-47.371,124.177-47.371,171.557,0
                        C468.869,82.897,468.869,159.706,421.512,207.074z M194.708,348.104l-30.521,30.532c-23.646,23.634-62.128,23.634-85.778,0
                        c-23.648-23.667-23.648-62.138,0-85.795l85.778-85.767c23.665-23.662,62.121-23.662,85.767,0
                        c7.388,7.39,12.204,16.302,14.986,25.706c2.249-1.307,4.56-2.369,6.454-4.266l39.861-39.845
                        c-5.092-8.678-10.958-17.03-18.421-24.477c-47.348-47.371-124.172-47.371-171.543,0L35.526,249.96
                        c-47.366,47.385-47.366,124.172,0,171.553c47.371,47.356,124.177,47.356,171.547,0l65.008-65.003
                        C246.109,360.336,219.437,357.723,194.708,348.104z" fill="#ffffff" />
                </g>
            </svg>
        ),
        style: INLINE_STYLE.HYPERLINK,
        description: "toolbar.add_link"
    }
];

export const BLOCK_BUTTONS = [
    {
        label: (
            <span className="name">H2</span>
        ),
        style: BLOCK_STYLE.H2,
        description: "toolbar.H2"
    },
    {
        label: (
            <span className="name">H4</span>
        ),
        style: BLOCK_STYLE.H4,
        description: "toolbar.H4"
    },
    {
        label: (
            <svg width="20" height="15" viewBox="0 0 95.333 95.332">
                <g>
                    <path d="M30.512,43.939c-2.348-0.676-4.696-1.019-6.98-1.019c-3.527,0-6.47,0.806-8.752,1.793
                        c2.2-8.054,7.485-21.951,18.013-23.516c0.975-0.145,1.774-0.85,2.04-1.799l2.301-8.23c0.194-0.696,0.079-1.441-0.318-2.045
                        s-1.035-1.007-1.75-1.105c-0.777-0.106-1.569-0.16-2.354-0.16c-12.637,0-25.152,13.19-30.433,32.076
                        c-3.1,11.08-4.009,27.738,3.627,38.223c4.273,5.867,10.507,9,18.529,9.313c0.033,0.001,0.065,0.002,0.098,0.002
                        c9.898,0,18.675-6.666,21.345-16.209c1.595-5.705,0.874-11.688-2.032-16.851C40.971,49.307,36.236,45.586,30.512,43.939z" fill="#ffffff" />
                    <path d="M92.471,54.413c-2.875-5.106-7.61-8.827-13.334-10.474c-2.348-0.676-4.696-1.019-6.979-1.019
                        c-3.527,0-6.471,0.806-8.753,1.793c2.2-8.054,7.485-21.951,18.014-23.516c0.975-0.145,1.773-0.85,2.04-1.799l2.301-8.23
                        c0.194-0.696,0.079-1.441-0.318-2.045c-0.396-0.604-1.034-1.007-1.75-1.105c-0.776-0.106-1.568-0.16-2.354-0.16
                        c-12.637,0-25.152,13.19-30.434,32.076c-3.099,11.08-4.008,27.738,3.629,38.225c4.272,5.866,10.507,9,18.528,9.312
                        c0.033,0.001,0.065,0.002,0.099,0.002c9.897,0,18.675-6.666,21.345-16.209C96.098,65.559,95.376,59.575,92.471,54.413z" fill="#ffffff" />
                </g>
            </svg>
        ),
        style: BLOCK_STYLE.BLOCKQUOTE,
        description: "toolbar.blockquote"
    },
    {
        style: BLOCK_STYLE.UL,
        icon: "fa-list-ul",
        description: "toolbar.UL"
    },
    {
        style: BLOCK_STYLE.OL,
        icon: "fa-list-ol",
        description: "toolbar.OL"
    }
];

export const MENU_BUTTONS = [
    {
        label: (
            <span className="name">H2</span>
        ),
        style: BLOCK_STYLE.H2,
        description: "toolbar.H2",
        block: true
    },
    {
        label: (
            <span className="name">H4</span>
        ),
        style: BLOCK_STYLE.H4,
        description: "toolbar.H4",
        block: true
    },
    {
        style: BLOCK_STYLE.OL,
        icon: "fa-list-ol",
        description: "toolbar.OL",
        block: true
    }
];

export const CUSTOM_STYLE_MAP = {
    [INLINE_STYLE.HIGHLIGHT]: {
        backgroundColor: "yellow"
    },
    [INLINE_STYLE.DANGER_TEXT]: {
        backgroundColor: "#ffb8c2"
    }
};

export const ADDONS = {
    PHOTOS: "PHOTOS",
    QUIZ: "QUIZ"
};